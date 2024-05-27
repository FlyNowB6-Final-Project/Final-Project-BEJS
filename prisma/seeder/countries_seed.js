const data = [
    {
        "name": "Indonesia",
        "code": "ID",
        "continent_id": 1
    },
    {
        "name": "Brunei Darussalam",
        "code": "BN",
        "continent_id": 1
    },
    {
        "name": "Kamboja",
        "code": "KH",
        "continent_id": 1
    },
    {
        "name": "Lao People's Democratic Republic",
        "code": "LA",
        "continent_id": 1
    },
    {
        "name": "Malaysia",
        "code": "MY",
        "continent_id": 1
    },
    {
        "name": "Myanmar",
        "code": "MM",
        "continent_id": 1
    },
    {
        "name": "Filipina",
        "code": "PH",
        "continent_id": 1
    },
    {
        "name": "Singapura",
        "code": "SG",
        "continent_id": 1
    },
    {
        "name": "Thailand",
        "code": "TH",
        "continent_id": 1
    },
    {
        "name": "Timor-Leste",
        "code": "TL",
        "continent_id": 1
    },
    {
        "name": "Vietnam",
        "code": "VN",
        "continent_id": 1
    }
];


async function countrySeed(prisma) {
    try {
        await prisma.country.createMany({ data })
        console.log('country data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = countrySeed
