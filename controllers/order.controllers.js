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
          where: { id: parseInt(order_id) },
          include: {
              detailFlight: {
                  include: {
                      flight: {
                          include: {
                              city_arrive: {
                                  select: {
                                      name: true,
                                      airport_name: true,
                                  }
                              },
                              city_destination: {
                                  select: {
                                      name: true,
                                      airport_name: true,
                                  }
                              },
                              DetailFlight: {
                                  include: {
                                      detailPlane: {
                                          include: {
                                              plane: {
                                                  include: {
                                                      airline_id: {
                                                          select: {
                                                              name: true,
                                                              logo_url: true
                                                          }
                                                      }
                                                  }
                                              },
                                              seat_class: {
                                                  select: {
                                                      type_class: true
                                                  }
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              },
              passenger: {
                  where: { order_id: parseInt(order_id) },
                  select: {
                      title: true,
                      fullname: true,
                      family_name: true,
                      age_group: true,
                      identity_number: true
                  }
              },
              Payment: true
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
      if (order.status === "paid") {
          const payment = await prisma.payment.findUnique({
              where: { order_id: order.id },
              select: { method_payment: true }
          });

          paymentType = payment ? payment.method_payment : null;
      }

      const passengers = order.passenger.map(passenger => ({
          title: passenger.title,
          fullname: passenger.fullname,
          family_name: passenger.family_name,
          identity_number: passenger.identity_number,
          age_group: passenger.age_group
      }));

      const result = {
          id: order.id,
          status: order.status,
          payment_type: paymentType || null,
          flight_detail: {
              departure: {
                  airport_name: order.detailFlight.flight.city_arrive.airport_name,
                  city: order.detailFlight.flight.city_arrive.name,
                  date: order.detailFlight.flight.date_flight,
                  time: order.detailFlight.flight.time_departure
              },
              arrival: {
                  airport_name: order.detailFlight.flight.city_destination.airport_name,
                  city: order.detailFlight.flight.city_destination.name,
                  date: order.detailFlight.flight.date_flight,
                  time: order.detailFlight.flight.time_arrive
              },
              airplane: {
                  airline: order.detailFlight.detailPlane.plane.airline_id.name,
                  seat_class: order.detailFlight.detailPlane.seat_class.type_class,
                  flight_number: order.detailFlight.flight.flight_number,
              },
              passengers
          },
          // Assuming that price and tax information needs to be calculated
          price_detail: {
              adult_count: passengers.filter(p => p.age_group === 'adult').length,
              child_count: passengers.filter(p => p.age_group === 'child').length,
              infant_count: passengers.filter(p => p.age_group === 'infant').length,
              adult_price: order.detailFlight.price,
              child_price: order.detailFlight.price * 0.75, // Assuming child price is 75% of adult price
              infant_price: 0, // Assuming infant price is free
              tax: order.tax,
              total_price: order.total_price + order.tax
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
