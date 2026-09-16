const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// Read .env.local to get DATABASE_URL
const envFile = fs.readFileSync(".env.local", "utf8");
const match = envFile.match(/DATABASE_URL=["']?(.*?)["']?(\r?\n|$)/);
const connectionString = match ? match[1].trim() : process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env.local or environment");
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
    const targetUsername = "shreefinancec@gmail.com";
    const targetPassword = "shree123";

    console.log(`Seeding admin credential in PostgreSQL database...`);
    console.log(`Username: ${targetUsername}`);
    console.log(`Password: ${targetPassword}`);

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(targetPassword, salt);

        // Find existing admin by username (case-insensitive)
        const existing = await prisma.admin.findFirst({
            where: {
                username: {
                    equals: targetUsername,
                    mode: "insensitive"
                }
            }
        });

        if (existing) {
            const updated = await prisma.admin.update({
                where: { id: existing.id },
                data: {
                    username: targetUsername,
                    passwordHash: passwordHash
                }
            });
            console.log("Successfully updated admin in database:", updated);
        } else {
            const created = await prisma.admin.create({
                data: {
                    username: targetUsername,
                    passwordHash: passwordHash
                }
            });
            console.log("Successfully created new admin in database:", created);
        }

        const allAdmins = await prisma.admin.findMany({
            select: { id: true, username: true, createdAt: true }
        });
        console.log("Current Admin users in DB:", allAdmins);
    } catch (err) {
        console.error("Error seeding admin in DB:", err);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
