import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Создаем роли
  const adminRole = await prisma.roles.upsert({
    where: { role_name: "ADMIN" },
    update: {},
    create: {
      role_name: "ADMIN",
    },
  });

  const userRole = await prisma.roles.upsert({
    where: { role_name: "USER" },
    update: {},
    create: {
      role_name: "USER",
    },
  });

  console.log({ adminRole, userRole });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
