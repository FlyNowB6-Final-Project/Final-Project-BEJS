const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const getAll = async () => {
    return await prisma.seatClass.findMany()
}

module.exports = {
    getAll
}