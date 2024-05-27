const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const get = async (params) => {
    try {
        return await prisma.continent.findMany(
            {
                where: {
                    name: {
                        contains: params
                    }
                },
                select: {
                    id: true,
                    name: true,
                    code: true,
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