const { PrismaClient } = require('@prisma/client')
const airlaneSeed = require('./seeder/airlanes_seed')
const prisma = new PrismaClient()
async function main() {
    await airlaneSeed(prisma)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })