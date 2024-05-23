
async function planeSeed(prisma) {
  const garuda = await prisma.airlines.findUnique({ where: { code: "GA123" } });
  const lionAir = await prisma.airlines.findUnique({ where: { code: "LI234" } });
  const batikAir = await prisma.airlines.findUnique({ where: { code: "BA345" } });
  const citilink = await prisma.airlines.findUnique({ where: { code: "CI456" } });
  const airAsia = await prisma.airlines.findUnique({ where: { code: "AI567" } });
  const sriwijaya = await prisma.airlines.findUnique({ where: { code: "SP678" } });
  const namAir = await prisma.airlines.findUnique({ where: { code: "NA789" } });
  const trigana = await prisma.airlines.findUnique({ where: { code: "TP890" } });
  const wingsAir = await prisma.airlines.findUnique({ where: { code: "WI901" } });
  const superAirJet = await prisma.airlines.findUnique({ where: { code: "SU012" } });

  await prisma.plane.deleteMany()
  await prisma.plane.createMany({
    data: [
      {
        name: "Boeing 737-800",
        brand: "Boeing",
        series: "10748",
        capacity: 189,
        airlinesId: garuda.id
      },
      {
        name: "Airbus A320",
        brand: "Airbus",
        series: "72635",
        capacity: 180,
        airlinesId: lionAir.id
      },
      {
        name: "Boeing 737-900ER",
        brand: "Boeing",
        series: "33790",
        capacity: 215,
        airlinesId: batikAir.id
      },
      {
        name: "Airbus A320neo",
        brand: "Airbus",
        series: "19748",
        capacity: 186,
        airlinesId: citilink.id
      },
      {
        name: "Airbus A320",
        brand: "Airbus",
        series: "55342",
        capacity: 180,
        airlinesId: airAsia.id
      },
      {
        name: "Boeing 737-801",
        brand: "Boeing",
        series: "18362",
        capacity: 189,
        airlinesId: sriwijaya.id
      },
      {
        name: "Boeing 737-500",
        brand: "Boeing",
        series: "33975",
        capacity: 110,
        airlinesId: namAir.id
      },
      {
        name: "ATR 42-300",
        brand: "ATR",
        series: "36829",
        capacity: 50,
        airlinesId: trigana.id
      },
      {
        name: "ATR 72-500",
        brand: "ATR",
        series: "99864",
        capacity: 74,
        airlinesId: wingsAir.id
      },
      {
        name: "Airbus A320",
        brand: "Airbus",
        series: "56472",
        capacity: 180,
        airlinesId: superAirJet.id
      }
    ]
  });

  console.log('Planes data seeded successfully');
}

module.exports = planeSeed;
