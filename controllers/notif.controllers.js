const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  index: async (req, res, next) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { user_id: Number(req.user.id) },
      });

      res.status(200).json({
        status: true,
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },
  readNotification: async (req, res, next) => {
    try {
      const notifications = await prisma.notification.updateMany({
        where: { user_id: Number(req.user.id) },
        data: {
          isRead: true,
        },
      });

      res.status(200).json({
        status: true,
        message: "Notifications marked as read for the user",
        data: notifications,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
