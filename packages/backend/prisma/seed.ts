import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an admin user if none exists
  const adminEmail = 'admin@jardinier.local';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: 'changeme',
        name: 'Admin',
        role: Role.ADMIN,
      },
    });
  }

  // Create a sample plant for the admin
  const plantName = 'Mon Ficus';
  const existing = await prisma.plant.findFirst({ where: { name: plantName, ownerId: admin.id } });
  if (!existing) {
    await prisma.plant.create({
      data: {
        name: plantName,
        species: 'Ficus lyrata',
        notes: 'Pièce lumineuse',
        owner: { connect: { id: admin.id } },
        schedules: {
          create: {
            waterQuantityMl: 500,
            frequencyDays: 7,
          },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
