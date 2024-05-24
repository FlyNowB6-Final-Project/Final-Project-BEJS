const data = [
    {
        "city_destination_id": 1,
        "city_arrive_id": 2,
        "flight_number": "sup-5707",
        "time_arrive": "2024-05-24T12:00:00.000Z",
        "time_departure": "2024-05-24T01:00:00.000Z",
        "date_flight": "2024-05-24",
        "estimation_minute": 240,
        "detail_data": {
            "plane_id": 1,
            "price": 500000
        }
    }
]

async function scheduleSeed(prisma) {
    try {
        data.forEach(async (v) => {
            const flightData = {
                city_destination_id: v.city_destination_id,
                city_arrive_id: v.city_arrive_id,
                flight_number: v.flight_number,
                time_arrive: new Date(v.time_arrive),
                time_departure: new Date(v.time_departure),
                date_flight: new Date(v.date_flight),
                estimation_minute: v.estimation_minute,
            };
            const createdFlight = await prisma.flight.create({ data: flightData });
            const detailData = {
                ...v.detail_data,
                flight_id: createdFlight.id
            };
            console.log(detailData)
            await prisma.detailFlight.create({ data: detailData });
        })
        console.log('schedule data seeded successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = scheduleSeed;
