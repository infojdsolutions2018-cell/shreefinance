const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const fs = require("fs");

// Read .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
const match = envFile.match(/DATABASE_URL=["']?(.*?)["']?(\r?\n|$)/);
const connectionString = match ? match[1].trim() : process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found");
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedPartner() {
    try {
        console.log("Seeding pending partner application in PostgreSQL...");

        const samplePartner = {
            referenceNo: "SHREE-PTR-8942",
            name: "Rajesh Kumar Sharma",
            email: "rajesh.sharma@example.com",
            mobile: "9876543210",
            city: "Pune",
            profession: "DSA / Loan Consultant",
            companyName: "Sharma Financial Advisory",
            location: "Kothrud, Pune",
            addressProofType: "Aadhaar Card",
            fullAddress: "Flat 304, Green Heights, Kothrud, Pune - 411038",
            experienceYears: "5+ Years",
            bankAccountType: "Current Account",
            status: "PENDING",
            isActive: false,
            uploadedDocuments: {
                panCard: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                aadhaarFront: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                aadhaarBack: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                bankProof: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
            }
        };

        const existing = await prisma.partnerApplication.findFirst({
            where: {
                OR: [
                    { email: samplePartner.email },
                    { referenceNo: samplePartner.referenceNo }
                ]
            }
        });

        if (existing) {
            const updated = await prisma.partnerApplication.update({
                where: { id: existing.id },
                data: {
                    ...samplePartner,
                    status: "PENDING",
                    isActive: false
                }
            });
            console.log("Updated partner application to PENDING:", updated.referenceNo, updated.name);
        } else {
            const created = await prisma.partnerApplication.create({
                data: samplePartner
            });
            console.log("Created new PENDING partner application:", created.referenceNo, created.name);
        }

        const counts = {
            total: await prisma.partnerApplication.count(),
            pending: await prisma.partnerApplication.count({ where: { status: "PENDING" } }),
            approved: await prisma.partnerApplication.count({ where: { status: "APPROVED" } }),
        };
        console.log("Current Partner Counts:", counts);

    } catch (err) {
        console.error("Error seeding partner:", err);
    } finally {
        await prisma.$disconnect();
    }
}

seedPartner();
