const data = [
    {
        name: 'Asia',
        code: 'AS'
    },
    {
        name: 'Amerika',
        code: 'AM'
    },
    {
        name: 'Eropa',
        code: 'EU'
    },
    {
        name: 'Afrika',
        code: 'AF'
    },
    {
        name: 'Australia',
        code: 'AU'
    },
    {
        name: 'Antarctica',
        code: 'AN'
    }
];

async function continentSeed(prisma) {
    try {
        await prisma.continent.createMany({ data })
        console.log("continent data seeded succesfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = continentSeed