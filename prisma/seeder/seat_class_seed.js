const data = [
    {
        "type_class": "Ekonomi"
    },
    {
        "type_class": "Ekonomi Premium"
    },
    {
        "type_class": "Bisnis"
    },
    {
        "type_class": "First Class"
    },
    {
        "type_class": "Quite Zone"
    }
]

async function seatClassSeed(prisma) {
    try {
        await prisma.seatClass.createMany({ data })
        console.log('seatClass data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = seatClassSeed