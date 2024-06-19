const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { convertToIso, formatDateTimeToUTC } = require('../utils/formattedDate');

module.exports = {
  countAllUser: async (req, res, next) => {
    try {
      const countUser = await prisma.user.count();

      res.status(200).json({
        status: true,
        message: "Success to count all users",
        data: countUser,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fullname: true,
          email: true,
          phoneNumber: true,
        },
      });

      res.status(200).json({
        status: true,
        message: "Successfully retrieved all users",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllOrder: async (req, res, next) => {
    try {
      const orders = await prisma.order.findMany({
        select: {
          id: true,
          code: true,
          detailFlight: {
            select: {
              id: true,
              price: true,
              detailPlaneId: {
                select: {
                  seat_class: {
                    select: {
                      id: true,
                      type_class: true,
                    },
                  },
                },
              },
              flight: {
                select: {
                  id: true,
                  flight_number: true,
                  time_arrive: true,
                  time_departure: true,
                  date_flight: true,
                  estimation_minute: true,
                  city_arrive: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      airport_name: true,
                    },
                  },
                  city_destination: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      airport_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        status: true,
        message: "Successfully retrieved all orders with plane details",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },
  getDetailOrderUser: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
  createNotif: async (req, res, next) => {
    try {
      const { title, message } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          status: false,
          message: "Title and message are required fields",
        });
      }

      const allUsers = await prisma.user.findMany();

      // Create notifications for all users using Promise.all
      const newNotification = await Promise.all(
        allUsers.map(async (user) => {
          const now = new Date();
          const isoDate = convertToIso({
            day: now.getDate().toString().padStart(2, "0"),
            month: (now.getMonth() + 1).toString().padStart(2, "0"),
            year: now.getFullYear().toString(),
            hour: now.getHours().toString().padStart(2, "0"),
            minutes: now.getMinutes().toString().padStart(2, "0"),
            second: now.getSeconds().toString().padStart(2, "0"),
          });
          return prisma.notification.create({
            data: {
              title,
              message,
              user_id: user.id,
              createdAt: isoDate,
            },
          });
        })
      );
      newNotification.forEach((value) => {
        value.createdAt = formatDateTimeToUTC(value.createdAt);
      });
      res.status(201).json({
        status: true,
        message: "Notifications created for all users",
        data: newNotification,
      });
    } catch (error) {
      next(error);
    }
  },
};
