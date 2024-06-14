const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { convertToIso, formatDateTimeToUTC } = require('../utils/formattedDate');

module.exports = {
  index: async (req, res, next) => {
    try {
      const { find, filter } = req.query;

      const conditions = {
        user_id: Number(req.user.id),
      };

      if (find) {
        conditions.title = { contains: find, mode: "insensitive" };
      }

      if (filter) {
        conditions.title = { equals: filter, mode: 'insensitive' };
      }

      const notifications = await prisma.notification.findMany({
        where: conditions,
      });

      notifications.forEach(value => {
        value.createdAt = formatDateTimeToUTC(value.createdAt)
      })

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
  readNotificationId: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      if (!notificationId) {
        return res.status(400).json({
          status: false,
          message: "Notification ID is required",
        });
      }

      const notification = await prisma.notification.update({
        where: { id: Number(notificationId) },
        data: {
          isRead: true,
        },
      });

      if (!notification) {
        return res.status(404).json({
          status: false,
          message: "Notification not found",
        });
      }

      notification.createdAt = formatDateTimeToUTC(notification.createdAt);

      res.status(200).json({
        status: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
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
            day: now.getDate().toString().padStart(2, '0'),
            month: (now.getMonth() + 1).toString().padStart(2, '0'),
            year: now.getFullYear().toString(),
            hour: now.getHours().toString().padStart(2, '0'),
            minutes: now.getMinutes().toString().padStart(2, '0'),
            second: now.getSeconds().toString().padStart(2, '0')
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
      newNotification.forEach(value => {
        value.createdAt = formatDateTimeToUTC(value.createdAt)
      })
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
