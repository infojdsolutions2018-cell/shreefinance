const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_TIs5tozFbQd8@ep-misty-paper-b5e22aue-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = 'shreefinance@gmail.com';
  const password = 'shree123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    await prisma.admin.update({ where: { username }, data: { passwordHash } });
    console.log('Admin password updated successfully for ' + username);
  } else {
    await prisma.admin.create({ data: { username, passwordHash } });
    console.log('Admin user created successfully for ' + username);
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
