const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const midtransClient = require("midtrans-client");
const {
  PAYMENT_DEV_CLIENT_KEY,
  PAYMENT_DEV_SERVER_KEY,
  PAYMENT_PROD_CLIENT_KEY,
  PAYMENT_PROD_SERVER_KEY,
} = process.env;

// Setup Midtrans client
const isProduction = false;

let snap = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: isProduction ? PAYMENT_PROD_SERVER_KEY : PAYMENT_DEV_SERVER_KEY,
  clientKey: isProduction ? PAYMENT_PROD_CLIENT_KEY : PAYMENT_DEV_CLIENT_KEY,
});

module.exports = {
  create: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const PPN = 11 / 100;

      // Retrieve the order along with detailFlight to get the price
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          detailFlight: true,
        },
      });

      if (!order) {
        return res.status(404).json({
          status: false,
          message: `Order with id ${orderId} not found`,
        });
      }

      // Check if the order is already paid
      if (order.status === "paid") {
        return res.status(400).json({
          status: false,
          message: "Order has already been paid",
        });
      }

      // Calculate the total amount including VAT (PPN)
      const baseAmount = order.detailFlight.price;
      const totalAmount = baseAmount + baseAmount * PPN;

      const { method_payment } = req.body;
      // const { method_payment, cardNumber, cardHolderName, cvv, expiryDate } = req.body;

      // Validate method_payment input
      if (!method_payment) {
        return res.status(400).json({
          status: false,
          message: "Payment method is required",
        });
      }

      // let responseMessage = "";
      // if (method_payment === "credit_card") {
      //   if (!cardNumber || !cardHolderName || !cvv || !expiryDate) {
      //     return res.status(400).json({
      //       status: false,
      //       message: "Credit card details are required",
      //       data: null,
      //     });
      //   }
      //   responseMessage = "Credit card payment validated successfully";
      // } else if (method_payment === "bank_account_VA" || method_payment === "gopay") {
      //   responseMessage = "Payment method validated successfully";
      // } else {
      //   return res.status(400).json({
      //     status: false,
      //     message: "Invalid payment method",
      //     data: null,
      //   });
      // }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          amount: totalAmount.toString(),
          method_payment,
          createdAt: new Date().toISOString(),
          order_id: parseInt(orderId),
        },
      });

      res.status(201).json({
        status: true,
        message: "Payment created and order updated successfully",
        data: {
          payment,
          originalPrice: baseAmount,
          totalPrice: totalAmount,
        },
      });

      // Update order status to 'PAID'
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: "paid" },
      });

      // Create notification for the payment status
      const notification = await prisma.notification.create({
        data: {
          title: "Payment Status: Paid",
          message: `Your order with booking code ${order.code} is currently Paid. Enjoy you're Flight`,
          createdAt: new Date().toISOString(),
          user: { connect: { id: req.user.id } },
        },
      });
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const payments = await prisma.payment.findMany();

      res.status(200).json({
        status: true,
        message: "All payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { id: parseInt(id) },
        include: {
          ordersId: true,
        },
      });

      if (!payment) {
        return res.status(404).json({
          status: false,
          message: "Payment not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Payment details retrieved successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },
  midtrans: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      if (isNaN(orderId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid order ID",
          data: null,
        });
      }
      const { method_payment } = req.body;

      // Validate input fields based on the payment method
      if (!method_payment) {
        return res.status(400).json({
          status: false,
          message: "Payment method is required",
          data: null,
        });
      }

      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          detailFlight: true,
          user: true,
        },
      });

      if (!order) {
        return res.status(404).json({
          status: false,
          message: `Order With Id ${orderId} Not Found`,
        });
      }

      if (order.status === "paid") {
        return res.status(400).json({
          status: false,
          message: "Order has already been paid",
          data: null,
        });
      }

      const totalAmount = order.detailFlight.price * (1 + 0.11); // Including 11% VAT (PPN 11%)

      // Define payment parameters for Midtrans API
      let parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.floor(totalAmount),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
        },
      };

      // Charge the transaction using Midtrans API
      let transaction = await snap.createTransaction(parameter);

      res.status(200).json({
        status: true,
        message: "Midtrans payment initiated successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
  confirmMidtrans: async (req, res, next) => {
    try {
      const {
        order_id,
        transaction_id,
        transaction_status,
        gross_amount,
        payment_type,
      } = req.body;

      // Validate order ID early
      if (isNaN(order_id)) {
        return res.status(400).json({
          status: false,
          message: "Invalid order ID",
        });
      }

      // Start a transaction to handle payment confirmation
      const transactionResult = await prisma.$transaction(async (prisma) => {
        const order = await prisma.order.findUnique({
          where: { id: parseInt(order_id) },
          include: { user: true }, // Ensure user data is included for notification
        });

        if (!order) {
          throw new Error("Order not found");
        }

        if (order.status === "paid") {
          throw new Error("Order has already been paid");
        }

        if (!["capture", "settlement"].includes(transaction_status)) {
          throw new Error(`Transaction is not successful. Status: ${transaction_status}`);
        }

        const payment = await prisma.payment.create({
          data: {
            order_id: parseInt(order_id),
            transaction_id,
            amount: gross_amount,
            method_payment: payment_type,
            status: transaction_status,
            createdAt: new Date().toISOString(),
          },
        });

        await prisma.order.update({
          where: { id: parseInt(order_id) },
          data: { status: "paid" },
        });

        const notification = await prisma.notification.create({
          data: {
            title: "Payment Status: Paid",
            message: `Your order with ID ${order_id} is currently Paid. Enjoy your Flight`,
            createdAt: new Date().toISOString(),
            user_id: order.user_id, // Correctly reference user_id from the order
          },
        });

        return {
          newPaymentId: payment.id,
          updatedOrderId: order.id,
          notificationId: notification.id,
        };
      });

      res.status(200).json({
        status: true,
        message: "Payment confirmed and booking status updated successfully",
        data: transactionResult,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "An error occurred during the transaction",
      });
    }
  },
};
