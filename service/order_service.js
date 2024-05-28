const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()


module.exports = {
    getAll: async () => {
        try {
            return prisma.order.findMany()
        } catch (error) {
            throw error
        }
    },
    getById: async () => {
        try {
            return prisma.order.findMany()
        } catch (error) {
            throw error
        }
    },
    getDataForRecomendation: async () => {
        try {
            const result = await prisma.$queryRaw`
                SELECT detail_flight_id, COUNT(id) as order_count
                FROM orders
                GROUP BY detail_flight_id`;

            console.log(result)
            return result
        } catch (error) {
            throw error
        }
    },
}