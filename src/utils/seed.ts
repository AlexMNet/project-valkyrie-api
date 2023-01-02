import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        firstName: 'Danny',
        lastName: 'Contreras',
        email: 'danny@gmail.com',
        password: await argon2.hash('ilovekritzia'),
      },
      {
        firstName: 'Alex',
        lastName: 'Maldonado',
        email: 'alex@gmail.com',
        password: await argon2.hash('testing123'),
      },
      {
        firstName: 'Shiany',
        lastName: 'Maldonado',
        email: 'shiany@gmail.com',
        password: await argon2.hash('ilovealexm'),
        role: 'ADMIN',
      },
    ],
  });

  const danny = await prisma.user.findUnique({
    where: { email: 'danny@gmail.com' },
  });

  const dannyRecords = await prisma.record.createMany({
    data: [
      { title: 'Patient Zero', authorId: danny?.id },
      { title: 'Patient Overwatch', authorId: danny?.id },
      { title: 'Patient Sigma', authorId: danny?.id },
    ],
  });

  const alex = await prisma.user.findUnique({
    where: { email: 'alex@gmail.com' },
  });

  const alexRecords = await prisma.record.createMany({
    data: [
      { title: 'Patient Valkyrie', authorId: alex?.id },
      { title: 'Patient TRex', authorId: alex?.id },
      { title: 'Patient Baptiste', authorId: alex?.id },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
