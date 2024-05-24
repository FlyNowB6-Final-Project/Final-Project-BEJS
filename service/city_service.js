const { PrismaClient } = require("@prisma/client");
const { param } = require("../routes/city.routes");
const prisma = new PrismaClient()

const get = async (params) => {
    try {
        return await prisma.city.findMany(
            {
                where: {
                    name: {
                        contains: params
                    }
                }

            }
        );
    } catch (error) {
        throw error
    }
}

module.exports = {
    get,
}