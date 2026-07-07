import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  {
    title: "Modern Loft in Downtown Lisbon",
    address: "Rua da Prata 45, 1100-419 Lisboa, Portugal",
    price: 425000,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
  },
  {
    title: "Beachfront Villa in Bali",
    address: "Jalan Batu Belig 12, Seminyak, Kuta, Bali 80361, Indonesia",
    price: 780000,
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
  },
  {
    title: "Historic Townhouse in Brooklyn",
    address: "123 Willow Street, Brooklyn Heights, NY 11201, USA",
    price: 1250000,
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
  },
];

async function main() {
  console.log("Seeding database...");
  await prisma.property.deleteMany({});
  for (const item of seedData) {
    const created = await prisma.property.create({ data: item });
    console.log("  created property", created.id, "-", created.title);
  }
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
