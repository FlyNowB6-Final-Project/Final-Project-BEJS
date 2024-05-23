const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const airlaneSeed = require('./seeder/airlanes_seed')
const planeSeed = require('./seeder/plane_seed')

async function main() {
    await airlaneSeed(prisma)
    await planeSeed(prisma)
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