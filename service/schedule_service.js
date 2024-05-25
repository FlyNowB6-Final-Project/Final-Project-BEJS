const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const getDataFind = async (city_arrive_id, city_destination_id) => {
    return await prisma.flight.findMany(
        {
            where: {
                city_arrive_id,
                city_destination_id,
            }
        }
    )
}

module.exports = {
    getDataFind
}