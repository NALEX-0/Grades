const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  const tables = ['Grade', 'Course', 'Examination', 'Semester', 'User'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
