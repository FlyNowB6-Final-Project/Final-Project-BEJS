const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

var cron = require("node-cron");
const { createSchedule } = require("./schedule_service");
const { getNextWeekDate, utcTimePlus7, convertToIso } = require("../utils/formattedDate");

const getDataSchedule = async () => {
    console.log(convertToIso({ hour: 12, minutes: 30, year: 2024 }))

    // await prisma.cronJobSchedule.create({
    //     data: {
    //         flight_key: "fpc",
    //         time_arrive: new Date("2023-01-01T12:30:00Z"),
    //         time_departure: new Date("2023-01-01T14:00:00Z"),
    //         estimation_minute: 90,
    //         city_arrive_id: 1,
    //         city_destination_id: 2,
    //         discount: 20,
    //     }
    // })


    // await prisma.detailCronJobSchedul.create({
    //     data: {
    //         cron_job_Schedule_id: 1,
    //         detail_plane_id: 1,
    //         price: 2000000
    //     }
    // })

    // await prisma.detailCronJobSchedul.create({
    //     data: {
    //         cron_job_Schedule_id: 1,
    //         detail_plane_id: 2,
    //         price: 2000000
    //     }
    // })


    let now = new Date();
    now.setDate(now.getDate() + 7);

    let hari = now.getDay();
    let data;

    switch (hari) {
        case 0:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isSunday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        case 1:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isMonday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        case 2:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isThuesday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        case 3:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isWednesday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        case 4:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isThursday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        case 5:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isFriday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        case 6:
            data = await prisma.cronJobSchedule.findMany({
                where: {
                    isSaturday: true
                },
                include: {
                    detail_cron_Job_Schedul
                }
            })
            break;
        default:
            data = 'Hari tidak valid';
    }


    // const cronJobSchedules = await prisma.cronJobSchedule.findMany({
    //     include: {
    //         detail_cron_Job_Schedul: true
    //     }
    // });


    // console.log(cronJobSchedules);






    const jsonData = {
        "city_arrive_id": 1,
        "city_destination_id": 2,
        "flight_number": "sup-5707",
        "time_arrive": "2024-05-24T15:30:00.000Z",
        "time_departure": "2024-05-24T05:00:00.000Z",
        "date_flight": "2024-05-",
        "estimation_minute": 240,
        "detail_data": [
            {
                "detail_plane_id": 1,
                "price": 500000
            },
            {
                "detail_plane_id": 2,
                "price": 1000000
            },
            {
                "detail_plane_id": 3,
                "price": 1500000
            },
            {
                "detail_plane_id": 4,
                "price": 2500000
            }
        ]
    }
}


getDataSchedule()
// var task = cron.schedule('0 0 * * *', () => {
// let pushdata = data
// pushdata.date_flight = getNextWeekDate()
// createSchedule(pushdata)
// }, { timezone: "Asia/Jakarta" });



// module.exports = task

// old data
// const data = {
//     "city_arrive_id": 1,
//     "city_destination_id": 2,
//     "flight_number": "sup-5707",
//     "time_arrive": "2024-05-24T15:30:00.000Z",
//     "time_departure": "2024-05-24T05:00:00.000Z",
//     "date_flight": "2024-05-",
//     "estimation_minute": 240,
//     "detail_data": [
//         {
//             "detail_plane_id": 1,
//             "price": 500000
//         },
//         {
//             "detail_plane_id": 2,
//             "price": 1000000
//         },
//         {
//             "detail_plane_id": 3,
//             "price": 1500000
//         },
//         {
//             "detail_plane_id": 4,
//             "price": 2500000
//         }
//     ]
// }