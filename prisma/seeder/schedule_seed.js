const data = [
    {
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
    },
    {
        "city_arrive_id": 2,
        "city_destination_id": 1,
        "flight_number": "mup-5708",
        "time_arrive": "2024-05-24T14:45:00.000Z",
        "time_departure": "2024-05-24T06:00:00.000Z",
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
    },
    {
        "city_arrive_id": 3,
        "city_destination_id": 1,
        "flight_number": "qua-5707",
        "time_arrive": "2024-05-24T16:15:00.000Z",
        "time_departure": "2024-05-24T07:00:00.000Z",
        "date_flight": "2024-05-",
        "estimation_minute": 240,
        "detail_data": [
            {
                "detail_plane_id": 5,
                "price": 500000
            },
            {
                "detail_plane_id": 6,
                "price": 1000000
            },
            {
                "detail_plane_id": 7,
                "price": 1500000
            },
            {
                "detail_plane_id": 8,
                "price": 2500000
            }
        ]
    },
    {
        "city_arrive_id": 1,
        "city_destination_id": 3,
        "flight_number": "gua-5708",
        "time_arrive": "2024-05-24T17:45:00.000Z",
        "time_departure": "2024-05-24T08:30:00.000Z",
        "date_flight": "2024-05-",
        "estimation_minute": 180,
        "detail_data": [
            {
                "detail_plane_id": 9,
                "price": 300000
            },
            {
                "detail_plane_id": 10,
                "price": 8000000
            },
            {
                "detail_plane_id": 11,
                "price": 1300000
            },
            {
                "detail_plane_id": 12,
                "price": 2300000
            }
        ]
    },
    {
        "city_arrive_id": 4,
        "city_destination_id": 3,
        "flight_number": "pug-5707",
        "time_arrive": "2024-05-24T19:30:00.000Z",
        "time_departure": "2024-05-24T10:00:00.000Z",
        "date_flight": "2024-05-",
        "estimation_minute": 180,
        "detail_data": [
            {
                "detail_plane_id": 13,
                "price": 300000
            },
            {
                "detail_plane_id": 14,
                "price": 8000000
            },
            {
                "detail_plane_id": 15,
                "price": 1300000
            },
            {
                "detail_plane_id": 16,
                "price": 2300000
            }
        ]
    },
]


async function scheduleSeed(prisma) {
    try {
        for (let i = 25; i < 30; i++) {
            for (const v of data) {
                const flightData = {
                    city_destination_id: v.city_destination_id,
                    city_arrive_id: v.city_arrive_id,
                    flight_number: v.flight_number + i,
                    time_arrive: new Date(v.time_arrive),
                    time_departure: new Date(v.time_departure),
                    date_flight: new Date(v.date_flight + i),
                    estimation_minute: v.estimation_minute,
                };

                const createdFlight = await prisma.flight.create({ data: flightData });

                const detailData = v.detail_data.map(detail => ({
                    detail_plane_id: detail.detail_plane_id,
                    price: detail.price,
                    flight_id: createdFlight.id,
                }));

                await prisma.detailFlight.createMany({ data: detailData });
            }
        }

        console.log("flight schedule data seeded successfulty");
        console.log('schedule data seeded successfully');
    } catch (error) {
        console.error('Error seeding schedule data:', error);
    }
}

module.exports = scheduleSeed;
