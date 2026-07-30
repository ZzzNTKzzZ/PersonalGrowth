import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function check() {
  const users = await prisma.user.findMany();
  console.log(`👤 DB Users count: ${users.length}`);
  if (users.length > 0) {
    console.log(`   User ID: ${users[0].id}, Email: ${users[0].email}`);
    
    const habits = await prisma.habit.findMany({ where: { userId: users[0].id } });
    console.log(`⚡ Habits for user ${users[0].email}: ${habits.length}`);
    
    const tasks = await prisma.task.findMany({ where: { userId: users[0].id } });
    console.log(`📋 Tasks for user ${users[0].email}: ${tasks.length}`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
