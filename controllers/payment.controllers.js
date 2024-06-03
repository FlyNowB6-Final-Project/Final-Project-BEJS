const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const midtransClient = require("midtrans-client");

// Setup Midtrans client
// let snap = new midtransClient.Snap({
//   serverKey: process.env.PAYMENT_DEV_SERVER_KEY,
//   clientKey: process.env.PAYMENT_DEV_CLIENT_KEY,
// });

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
      if (order.status === "Paid") {
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
        data: { status: "Paid" },
      });

      res.status(201).json({
        status: true,
        message: "Payment created and order updated successfully",
        data: payment,
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
//   midtrans: async (req, res, next) => {
//     try {
//       const { orderId } = req.params;
//       if (isNaN(orderId)) {
//         return res.status(400).json({
//           status: false,
//           message: "Invalid order ID",
//           data: null,
//         });
//       }

//       const { paymentMethod } = req.body;
//       if (!paymentMethod) {
//         return res.status(400).json({
//           status: false,
//           message: "Payment method is required",
//           data: null,
//         });
//       }

//       const order = await prisma.order.findUnique({
//         where: { id: parseInt(orderId) },
//         include: {
//           detailFlight: true,
//           user: true,
//         },
//       });

//       if (!order) {
//         return res.status(404).json({
//           status: false,
//           message: `Order With Id ${orderId} Not Found`,
//         });
//       }

//       if (order.status === "PAID") {
//         return res.status(400).json({
//           status: false,
//           message: "Order has already been paid",
//           data: null,
//         });
//       }

//       const parameter = {
//         transaction_details: {
//           order_id: order.id,
//           gross_amount: order.detailFlight.price,
//         },
//         credit_card: {
//           secure: true,
//         },
//         customer_details: {
//           first_name: order.user.fullname,
//           email: order.user.email,
//           phone: order.user.phoneNumber,
//         },
//       };

//       const transaction = await snap.createTransaction(parameter);
//       res.status(200).json({
//         status: true,
//         message: "Midtrans payment initiated successfully",
//         redirect_url: transaction.redirect_url,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
};
