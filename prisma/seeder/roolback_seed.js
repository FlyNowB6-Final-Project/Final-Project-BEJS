async function roolbackSeed(prisma) {
    try {
        await prisma.plane.deleteMany()
        await prisma.airlines.deleteMany()
        await prisma.city.deleteMany()
        await prisma.country.deleteMany()
        await prisma.continent.deleteMany()
        await prisma.seatClass.deleteMany()
        await prisma.$executeRaw`TRUNCATE TABLE flights, detail_plane, passengers, orders, detail_flight, planes, airlines, cities, countries, continents RESTART IDENTITY`
        console.log("success rollback all data")
    } catch (e) {
        console.log(e)
    }
}


module.exports = roolbackSeed