const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { convertToIso, formatDateTimeToUTC } = require("../utils/formattedDate");
const { createCronSchedule, createDetailCronSchedule, getCronSchedule } = require("../service/cron_upload_service");
const cronScheduleValidation = require("../validation/cron_schedule_validation");
const { validate } = require("../validation/validation");
const { generateRandomString } = require("../utils/helper");
const jsonResponse = require("../utils/response");

module.exports = {
  countAllUser: async (req, res, next) => {
    try {
      const countUser = await prisma.user.count();

      const countOrder = await prisma.order.count();

      const countFlight = await prisma.flight.count();

      res.status(200).json({
        status: true,
        message: "Success to count all users",
        data: { countUser, countOrder, countFlight },
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
          status: true,
          code: true,
          user_id: true,
          detailFlight: {
            select: {
              id: true,
              price: true,
              detailPlaneId: {
                select: {
                  plane: true,
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
      const userId = req.params.userId;

      const order = await prisma.order.findMany({
        where: {
          user_id: parseInt(userId),
        },
        select: {
          id: true,
          status: true,
          code: true,
          detailFlight: {
            select: {
              id: true,
              price: true,
              detailPlaneId: {
                select: {
                  plane: true,
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
        message: "Successfully retrieved detail order by userId",
        data: order,
      });
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
  uploadCronAdmin: async (req, res, next) => {
    try {
      const requestBody = validate(cronScheduleValidation, req.body)

      let [departureHour, departureMinute] = requestBody.time_departure.split(':').map(Number);
      let [arrivalHour, arrivalMinute] = requestBody.time_arrive.split(':').map(Number);

      let departureInMinutes = departureHour * 60 + departureMinute;
      let arrivalInMinutes = arrivalHour * 60 + arrivalMinute;
      let differenceInMinutes = arrivalInMinutes - departureInMinutes;


      let data = await createCronSchedule({
        flight_key: generateRandomString(6),
        city_arrive_id: requestBody.city_arrive_id,
        city_destination_id: requestBody.city_destination_id,
        time_arrive: convertToIso({ time: requestBody.time_arrive }),
        time_departure: convertToIso({ time: requestBody.time_departure }),
        estimation_minute: differenceInMinutes,
        discount: requestBody.discount,
        isMonday: requestBody.is_monday,
        isThuesday: requestBody.is_thuesday,
        isWednesday: requestBody.is_wednesday,
        isThursday: requestBody.is_thursday,
        isFriday: requestBody.is_friday,
        isSaturday: requestBody.is_saturday,
        isSunday: requestBody.is_sunday
      })

      let detail = [];
      for (let i = 0; i < requestBody.category.length; i++) {
        const categoryData = requestBody.category[i];
        const result = await createDetailCronSchedule(categoryData.price, categoryData.detail_plane_id, data.id);
        detail.push(result);
      }

      data.detail = detail


      return jsonResponse(res, 200, {
        status: true,
        message: "succes add new flight schedule",
        data,
      })
    } catch (error) {
      next(error)
    }
  },

  getCronJobData: async (req, res, next) => {
    try {
      const data = await getCronSchedule()
      return jsonResponse(res, 200, {
        status: true,
        message: "succes add new flight schedule",
        data,
      })
    } catch (error) {
      next(error)
    }
  }
};
