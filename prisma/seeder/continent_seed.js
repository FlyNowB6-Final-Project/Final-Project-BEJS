const data = [
    {
        name: 'asia',
        code: 'AS'
    },
    {
        name: 'amerika',
        code: 'AM'
    },
    {
        name: 'eropa',
        code: 'EU'
    },
    {
        name: 'afrika',
        code: 'AF'
    },
    {
        name: 'australia',
        code: 'AU'
    },
    {
        name: 'antarctica',
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