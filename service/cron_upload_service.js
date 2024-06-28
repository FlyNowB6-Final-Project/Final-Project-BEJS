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
        const data = await prisma.cronJobSchedule.create({
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

const createDetailCronSchedule = async (price, detailPlaneId, cronJobScheduleId) => {
    try {
        const result = await prisma.detailCronJobSchedul.create({
            data: {
                price: price,
                detail_plane_id: detailPlaneId,
                cron_job_Schedule_id: cronJobScheduleId,
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}


const getCronSchedule = async () => {
    try {
        const result = await prisma.cronJobSchedule.findMany({
            include: {
                detail_cron_Job_Schedul: true,
                city_arrive: true,
                city_destination: true,
            },
        });
        return result
    } catch (error) {
        throw error
    }
}


module.exports = {
    createCronSchedule,
    createDetailCronSchedule,
    getCronSchedule
}