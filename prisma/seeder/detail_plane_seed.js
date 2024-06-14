const fs = require("fs")

async function detailPlaneSeed(prisma) {
    try {
        const rawData = fs.readFileSync('./assets/core/detail_plane_seed_data.json');
        const data = JSON.parse(rawData);
        await prisma.detailPlane.createMany({ data })
        console.log('detailPlane data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = detailPlaneSeed
