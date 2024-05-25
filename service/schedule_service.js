const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const getDataFind = async (city_arrive_id, city_destination_id, date_departure) => {
    return await prisma.flight.findMany(
        {
            where: {
                city_arrive_id,
                city_destination_id,
                date_flight: date_departure
            },
            include: {
                DetailFlight: {
                    select: {
                        price: true,
                        
                        Plane: {
                            select: {
                                DetailPlane: true,
                                airline_id: {
                                    select: {
                                        code: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                city_arrive: {
                    select: {
                        code: true,
                        name: true,
                        airport_name: true
                    }
                },
                city_destination: {
                    select: {
                        code: true,
                        name: true,
                        airport_name: true
                    }
                },
            }
        }
    )
}

module.exports = {
    getDataFind
}