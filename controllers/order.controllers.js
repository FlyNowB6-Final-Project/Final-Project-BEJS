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
        const { id } = req.user;
        
        const orders = await prisma.order.findMany({
            where: { user_id: id },
            include: {
                detailFlight: {
                    include: {
                        flight: {
                            include: {
                                city_arrive: {
                                    select: {
                                        name: true,
                                    }
                                },
                                city_destination: {
                                    select: {
                                        name: true,
                                    }
                                }
                            },
                            select: {
                                id: true,
                                date_flight: true,
                                time_departure: true,
                                time_arrive: true,
                                estimation_minute: true,
                            }
                        }
                    }
                },
            },
            orderBy: {
                detailFlight: {
                    flight: {
                        date_flight: 'desc',
                    },
                },
            },
        });

        const result = await Promise.all(orders.map(async (order) => {
            let status = order.status;
            if (order.status === "unpaid" && moment().isAfter(order.expired_paid)) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: "canceled" }
                }).catch(error => next(error));
                status = "canceled";
            }
            return {
                id: order.id,
                date: order.detailFlight.flight.date_flight,
                status: status,
                booking_code: order.code,
                seat_class: order.detailFlight.detailPlane.seat_class.type_class,
                paid_before: order.expired_paid,
                price: convert.NumberToCurrency(order.detailFlight.price),
                flight_detail: {
                    departure_city: order.detailFlight.flight.city_arrive.name,
                    arrival_city: order.detailFlight.flight.city_destination.name,
                    departure_time: order.detailFlight.flight.time_departure,
                    arrival_time: order.detailFlight.flight.time_arrive,
                    duration: convert.DurationToString(order.detailFlight.flight.estimation_minute),
                },
            };
        }));

        return res.status(200).json({
            message: "Success get all orders",
            data: result
        });

    } catch (error) {
        next(error);
    }
},

  getDetail: async (req, res, next) => {
    try {
        const { id } = req.user;
        const { order_id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: order_id, user_id: id },
            include: {
                flight: {
                    include: {
                        airplane: {
                            include: {
                                airline: {
                                    select: {
                                        name: true,
                                        logo: true
                                    }
                                }
                            }
                        },
                        departure_airport: {
                            select: {
                                name: true,
                                city: true
                            }
                        },
                        arrival_airport: {
                            select: {
                                name: true,
                                city: true
                            }
                        }
                    }
                },
                passengers: {
                    where: { order_id },
                    select: {
                        title: true,
                        fullname: true,
                        ktp: true,
                        age_group: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(400).json({
                error: "Order not found",
                message: `Order with id ${order_id} not found`
            });
        }

        // Check payment status
        let paymentType;
        if (order.status === "PAID") {
            const payment = await prisma.payment.findUnique({
                where: { order_id: order.id },
                select: { type: true }
            });

            paymentType = payment ? payment.type : null;
        }

        const price = await prisma.price.findUnique({
            where: {
                flight_id_seat_type: {
                    flight_id: order.flight.id,
                    seat_type: order.seat_type
                }
            }
        });

        // Count age group in passengers data
        let adult = 0, child = 0, infant = 0;
        const passengers = order.passengers.map(passenger => {
            if (passenger.age_group === "adult") adult++;
            if (passenger.age_group === "child") child++;
            if (passenger.age_group === "infant") infant++;
            return {
                title: passenger.title,
                fullname: passenger.fullname,
                ktp: passenger.ktp
            };
        });

        // if the order has not been paid, show paid_before value
        let paid_before = convert.databaseToDateFormat(order.paid_before);
        paid_before = moment().isAfter(paid_before) || order.status !== "UNPAID" ? null : paid_before;

        const result = {
            id: order.id,
            booking_code: order.booking_code,
            status: order.status,
            payment_type: paymentType ? paymentType : null,
            paid_before,
            flight_detail: {
                departure: {
                    airport_name: order.flight.departure_airport.name,
                    city: order.flight.departure_airport.city,
                    date: moment(order.flight.date).tz(TZ).format("dddd DD MMMM YYYY"),
                    time: convert.timeWithTimeZone(order.flight.departure_time)
                },
                arrival: {
                    airport_name: order.flight.arrival_airport.name,
                    city: order.flight.arrival_airport.city,
                    date: moment(order.flight.date).tz(TZ).format("dddd DD MMMM YYYY"),
                    time: convert.timeWithTimeZone(order.flight.arrival_time)
                },
                airplane: {
                    airline: order.flight.airplane.airline.name,
                    seat_class: order.seat_type,
                    flight_number: order.flight.flight_number,
                    logo: order.flight.airplane.airline.logo,
                    baggage: order.flight.free_baggage,
                    cabin_baggage: order.flight.cabin_baggage
                },
                passengers
            },
            price_detail: {
                adult_count: adult,
                child_count: child === 0 ? null : child,
                infant_count: infant === 0 ? null : infant,
                adult_price: convert.NumberToCurrency(adult * price.price),
                child_price: child === 0 ? null : convert.NumberToCurrency(child * price.price),
                infant_price: infant === 0 ? null : convert.NumberToCurrency(0),
                tax: convert.NumberToCurrency(order.tax),
                total_price: convert.NumberToCurrency(order.total_price + order.tax)
            }
        };

        return res.status(200).json({
            message: "Success get detail order",
            data: result
        });

    } catch (error) {
        next(error);
    }
},
};
