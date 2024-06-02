const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const country = await prisma.country.findMany();

            res.status(200).json({
              status: true,
              message: "All country retrieved successfully",
              data: country,
            });
        } catch (error) {
            next(error)
        }
    }
}