const data = [
    {
        "total_seat": 80,
        "seat_class_id": 1,
        "plane_id": 1
    },
    {
        "total_seat": 50,
        "seat_class_id": 2,
        "plane_id": 1
    },
    {
        "total_seat": 20,
        "seat_class_id": 3,
        "plane_id": 1
    }
];


async function detailPlaneSeed(prisma) {
    try {
        await prisma.detailPlane.createMany({ data })
        console.log('detailPlane data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = detailPlaneSeed
