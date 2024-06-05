const { PrismaClient } = require("@prisma/client");
const { getCityId } = require("./city_service");
const prisma = new PrismaClient()

const getDataFind = async (city_arrive_id, city_destination_id, date_departure) => {
    let arrive = await getCityId(city_arrive_id)
    let destination = await getCityId(city_destination_id)

    if (!arrive || !destination) {
        return null
    }

    return await prisma.flight.findMany({
        where: {
            city_arrive_id: arrive,
            city_destination_id: destination,
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
            }
        }
    })
}

let getDetailFlightById = async (detailFlightId) => {
    return await prisma.detailFlight.findUnique({
        where: {
            id: detailFlightId
        },
        select: {
            detailPlaneId: {
                select: {
                    plane: {
                        select: {
                            name: true
                        }
                    },

                }
            },
            flight: {
                select: {
                    city_arrive: true,
                    city_destination: true,
                    estimation_minute: true
                }
            },
            price: true
        }
    })
}


let getDetailFlight = async () => {
    return await prisma.detailFlight.findMany({
        select: {
            detailPlaneId: {
                select: {
                    plane: {
                        select: {
                            name: true
                        }
                    },

                }
            },
            flight: {
                select: {
                    city_arrive: true,
                    city_destination: true,
                    estimation_minute: true
                }
            },
            price: true
        },
        take: 5
    })
}


module.exports = {
    getDataFind,
    getDetailFlightById,
    getDetailFlight
}