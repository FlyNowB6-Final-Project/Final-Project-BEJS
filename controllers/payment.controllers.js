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

      // Validate method_payment input
      if (!method_payment) {
        return res.status(400).json({
          status: false,
          message: "Payment method is required",
        });
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          amount: totalAmount.toString(),
          method_payment,
          createdAt: new Date().toISOString(),
          order_id: parseInt(orderId),
        },
      });

      // Update order status to 'PAID'
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: "paid" },
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
      const {method_payment} = req.body;

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

      const totalAmount = order.detailFlight.price * (1 + 0.11); // Including 11% VAT

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

      // Set payment type based on the method_payment
      // switch (method_payment) {
      //   case "Credit Card":
      //     if (!cardNumber || !cvv || !expiryDate) {
      //       return res.status(400).json({
      //         status: false,
      //         message: "Credit card details are required",
      //         data: null,
      //       });
      //     }
      //     const cardExpiry = expiryDate.split("/");
      //     parameter.payment_type = "credit_card";
      //     parameter.credit_card = {
      //       token_id: await getCardToken(
      //         cardNumber,
      //         cardExpiry[0],
      //         cardExpiry[1].slice(-2),
      //         cvv
      //       ),
      //       authentication: true,
      //     };
      //     break;
      //   case "Bank Transfer":
      //     if (!bankName) {
      //       return res.status(400).json({
      //         status: false,
      //         message: "Bank name is required for bank transfer",
      //         data: null,
      //       });
      //     }
      //     parameter.payment_type = "bank_transfer";
      //     parameter.bank_transfer = {
      //       bank: bankName,
      //       va_number: "1234567890",
      //     };
      //     break;
      //   case "Gopay":
      //     parameter.payment_type = "gopay";
      //     parameter.gopay = {
      //       enable_callback: true,
      //       callback_url: "localhost:3000/payment-success",
      //     };
      //     break;
      //   case "Indomaret":
      //     parameter.payment_type = "cstore";
      //     parameter.cstore = {
      //       store: "indomaret",
      //       message: message,
      //     };
      //     break;
      //   default:
          // return res.status(400).json({
          //   status: false,
          //   message: "Unsupported payment method",
          //   data: null,
          // });
      // }

      // Charge the transaction using Midtrans API
      let transaction = await snap.createTransaction(parameter);

      // // Create payment record
      // const payment = await prisma.payment.create({
      //   data: {
      //     amount: totalAmount.toString(),
      //     method_payment,
      //     createdAt: new Date().toISOString(),
      //     order_id: parseInt(orderId),
      //   },
      // });

      // // Update order status to 'PAID'
      // await prisma.order.update({
      //   where: { id: parseInt(orderId) },
      //   data: { status: "paid" },
      // });

      res.status(200).json({
        status: true,
        message: "Midtrans payment initiated successfully",
        data: transaction,
      });
      // // Create notification for the payment status
      // const notification = await prisma.notification.create({
      //   data: {
      //     title: "Payment Status: Paid",
      //     message: `Your order with booking code ${order.code} is currently Paid. Enjoy your Flight`,
      //     createdAt: new Date().toISOString(),
      //     user: { connect: { id: req.user.id } },
      //   },
      // });
    } catch (error) {
      next(error);
    }
  },
};
