const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const createCronSchedule = async ({
    flight_key,
    time_arrive,
    time_departure,
    city_arrive_id,
    city_destination_id,
    estimation_minute,
    discount,
    isMonday,
    isThuesday,
    isWednesday,
    isThursday,
    isFriday,
    isSaturday,
    isSunday
}) => {
    try {
        let data = await prisma.cronJobSchedule.create({
            data: {
                flight_key,
                time_arrive,
                time_departure,
                city_arrive_id,
                city_destination_id,
                estimation_minute,
                discount,
                isMonday,
                isThuesday,
                isWednesday,
                isThursday,
                isFriday,
                isSaturday,
                isSunday,
            }
        })
        return data
    } catch (error) {
        throw error
    }
}


module.exports = {
    createCronSchedule
}