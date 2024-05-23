async function airlaneSeed(prisma) {
    await prisma.airlines.createMany({
        data:
            [
                {
                    code: "GA123",
                    name: "Garuda Indonesia",
                    since: "1949",
                    logo_url: "http://example.com/logos/garuda.png",

                },
                {
                    code: "LI234",
                    name: "Lion Air",
                    since: "1999",
                    logo_url: "http://example.com/logos/lionair.png",

                },
                {
                    code: "BA345",
                    name: "Batik Air",
                    since: "2013",
                    logo_url: "http://example.com/logos/batikair.png",

                },
                {
                    code: "CI456",
                    name: "Citilink",
                    since: "2001",
                    logo_url: "http://example.com/logos/citilink.png",

                },
                {
                    code: "AI567",
                    name: "AirAsia Indonesia",
                    since: "2004",
                    logo_url: "http://example.com/logos/airasia.png",

                },
                {
                    code: "SP678",
                    name: "Sriwijaya Air",
                    since: "2003",
                    logo_url: "http://example.com/logos/sriwijaya.png",

                },
                {
                    code: "NA789",
                    name: "NAM Air",
                    since: "2013",
                    logo_url: "http://example.com/logos/namair.png",

                },
                {
                    code: "TP890",
                    name: "Trigana Air",
                    since: "1991",
                    logo_url: "http://example.com/logos/trigana.png",

                },
                {
                    code: "WI901",
                    name: "Wings Air",
                    since: "2003",
                    logo_url: "http://example.com/logos/wingsair.png",

                },
                {
                    code: "SU012",
                    name: "Super Air Jet",
                    since: "2020",
                    logo_url: "http://example.com/logos/superairjet.png",

                }
            ]
    })
}

module.exports = airlaneSeed