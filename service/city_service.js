const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const get = async (params) => {
    try {
        return await prisma.city.findMany();
    } catch (error) {
        throw error
    }
}

module.exports = {
    get,
}