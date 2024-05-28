const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllFlights: async (req, res, next) => {
    try {
      const flights = await prisma.flight.findMany();

      res.status(200).json({
        status: true,
        message: "All flights retrieved successfully",
        data: flights,
      });
    } catch (error) {
      next(error);
    }
  },
  getDetailFlights: async (req, res, next) => {
    try {
      const flightId = parseInt(req.params.id);
      const flight = await prisma.flight.findUnique({
        where: { id: flightId },
        include: {
          city_arrive: true,
          city_destination: true,
        },
      });

      if (flight) {
        delete flight.city_arrive_id;
        delete flight.city_destination_id;
        res.status(200).json({
          status: true,
          message: "Flight details retrieved successfully",
          data: flight,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Flight not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
