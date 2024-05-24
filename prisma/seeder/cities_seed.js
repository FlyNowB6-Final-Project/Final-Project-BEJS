const data = [
    {
        "name": "Tangerang",
        "code": "CGK",
        "airport_name": "Bandara Internasional Soekarno-Hatta",
        "country_id": 1
    },
    {
        "name": "Denpasar",
        "code": "DPS",
        "airport_name": "Bandara Internasional Ngurah Rai",
        "country_id": 1
    },
    {
        "name": "Surabaya",
        "code": "SUB",
        "airport_name": "Bandara Internasional Juanda",
        "country_id": 1
    },
    {
        "name": "Makassar",
        "code": "UPG",
        "airport_name": "Bandara Internasional Sultan Hasanuddin",
        "country_id": 1
    },
    {
        "name": "Yogyakarta",
        "code": "JOG",
        "airport_name": "Bandara Internasional Adisutjipto",
        "country_id": 1
    },
    {
        "name": "Medan",
        "code": "KNO",
        "airport_name": "Bandara Internasional Kualanamu",
        "country_id": 1
    },
    {
        "name": "Palembang",
        "code": "PLM",
        "airport_name": "Bandara Internasional Sultan Mahmud Badaruddin II",
        "country_id": 1
    },
    {
        "name": "Lombok",
        "code": "LOP",
        "airport_name": "Bandara Internasional Lombok",
        "country_id": 1
    },
    {
        "name": "Balikpapan",
        "code": "BPN",
        "airport_name": "Bandara Internasional Sultan Aji Muhammad Sulaiman",
        "country_id": 1
    },
    {
        "name": "Banda Aceh",
        "code": "BTJ",
        "airport_name": "Bandara Internasional Sultan Iskandar Muda",
        "country_id": 1
    },
    {
        "name": "Manado",
        "code": "MDC",
        "airport_name": "Bandara Internasional Sam Ratulangi",
        "country_id": 1
    },
    {
        "name": "Padang",
        "code": "PDG",
        "airport_name": "Bandara Internasional Minangkabau",
        "country_id": 1
    },
    {
        "name": "Batam",
        "code": "BTH",
        "airport_name": "Bandara Internasional Hang Nadim",
        "country_id": 1
    },
]


async function citySeed(prisma) {
    try {
        await prisma.city.createMany({ data })
        console.log('city data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = citySeed