const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const getDataFind = async (city_arrive_id, city_destination_id, date_departure) => {
    return await prisma.flight.findMany(
        {
            where: {
                city_arrive_id,
                city_destination_id,
                date_flight: date_departure,
            },
            include: {
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
                DetailFlight: {
                    select: {
                        price: true,
                        detailPlaneId: {
                            select: {

                                seat_class: {
                                    select: {
                                        type_class: true
                                    }
                                },
                                plane: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }

                    }
                },
            }
        }
    )
}

module.exports = {
    getDataFind
}