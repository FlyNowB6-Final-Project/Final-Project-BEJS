const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generatedOrderCode } = require("../utils/orderCodeGenerator");

module.exports = {
  order: async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        data: null,
      });
    }

    const detailFlightId = req.params.detailFlightId;
    const { passengers } = req.body;

    // Validate passenger data
    if (!passengers || !passengers.length) {
      return res.status(400).json({
        status: "error",
        message: "No passengers provided",
        data: null,
      });
    }

    const requiredFields = [
      "title",
      "fullname",
      "family_name",
      "birth_date",
      "nationality",
      "identity_type",
      "identity_number",
      "expired_date",
      "issuing_country",
    ];
    for (const passenger of passengers) {
      for (const field of requiredFields) {
        if (!passenger[field]) {
          return res.status(400).json({
            status: "error",
            message: `Missing '${field}' in passenger details`,
            data: null,
          });
        }
      }
    }

    try {
      const newOrder = await prisma.order.create({
        data: {
          user: { connect: { id: req.user.id } },
          detailFlight: { connect: { id: parseInt(detailFlightId) } },
          code: generatedOrderCode(),
          status: "unpaid",
          expired_paid: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          passenger: {
            createMany: {
              data: passengers.map((passenger) => ({
                title: passenger.title,
                fullname: passenger.fullname,
                family_name: passenger.family_name,
                birth_date: new Date(passenger.birth_date),
                nationality: passenger.nationality,
                identity_type: passenger.identity_type,
                identity_number: passenger.identity_number,
                expired_date: new Date(passenger.expired_date),
                issuing_country: passenger.issuing_country,
              })),
            },
          },
        },
        include: {
          passenger: true,
        },
      });

      const notification = await prisma.notification.create({
        data: {
          title: "Payment Status: Unpaid",
          message: `Your order with booking code ${
            newOrder.code
          } is currently unpaid. Please completed your payment  ${newOrder.expired_paid.toISOString()}.`,
          createdAt: new Date().toISOString(),
          user: { connect: { id: req.user.id } },
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Order created successfully",
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          passenger: true,
          detailFlight: true,
        },
      });
      return res.status(200).json({
        status: "success",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  getDetail: async (req, res, next) => {
    const { orderId } = req.params;
    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          passenger: true,
          detailFlight: true,
        },
      });
      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }
      return res.status(200).json({
        status: "success",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};
