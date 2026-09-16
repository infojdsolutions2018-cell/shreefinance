const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// Read .env.local for DATABASE_URL
const envFile = fs.readFileSync(".env.local", "utf8");
const match = envFile.match(/DATABASE_URL=["']?(.*?)["']?(\r?\n|$)/);
const connectionString = match ? match[1].trim() : process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const usersToSeed = [
    {
        name: "Akash Jadhav",
        email: "aakasharunjadhav@gmail.com",
        rawPassword: "akya123",
        mobile: "9325174465",
        city: "Pusad",
        subProduct: "Car Loan",
        applicationAmount: 50000,
        bankName: "HDFC Bank",
        referenceNo: "SHREE-PTR-7011",
        fileReferenceNo: "SHREE-FIL-5011"
    },
    {
        name: "Atharva Patharkar",
        email: "atharva@gmail.com",
        rawPassword: "athaya123",
        mobile: "9420467377",
        city: "Pune",
        subProduct: "Education Loan",
        applicationAmount: 70000,
        bankName: "SBI Bank",
        referenceNo: "SHREE-PTR-7012",
        fileReferenceNo: "SHREE-FIL-5012"
    },
    {
        name: "Aishwarya Sulagadle",
        email: "sulagadleaishwarya@gmail.com",
        rawPassword: "aishu123",
        mobile: "8087631421",
        city: "Pune",
        subProduct: "Home Loan",
        applicationAmount: 80000,
        bankName: "Bank of Maharashtra",
        referenceNo: "SHREE-PTR-7013",
        fileReferenceNo: "SHREE-FIL-5013"
    }
];

async function seedThreeUsers() {
    console.log("=== SEEDING 3 USERS INTO POSTGRESQL DATABASE ===");

    try {
        for (const user of usersToSeed) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(user.rawPassword, salt);

            // 1. Create or Update PartnerApplication (User Account)
            let partner = await prisma.partnerApplication.findFirst({
                where: {
                    OR: [
                        { email: user.email },
                        { referenceNo: user.referenceNo }
                    ]
                }
            });

            if (partner) {
                partner = await prisma.partnerApplication.update({
                    where: { id: partner.id },
                    data: {
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        city: user.city,
                        profession: `${user.subProduct} Applicant`,
                        companyName: "Individual Applicant",
                        location: user.city,
                        fullAddress: `${user.city}, Maharashtra`,
                        status: "APPROVED",
                        isActive: true,
                        passwordHash: passwordHash,
                        initialPasswordSent: true
                    }
                });
                console.log(`[USER UPDATED] ${user.name} (${user.email}) -> Status: APPROVED, Password set.`);
            } else {
                partner = await prisma.partnerApplication.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        city: user.city,
                        profession: `${user.subProduct} Applicant`,
                        companyName: "Individual Applicant",
                        location: user.city,
                        fullAddress: `${user.city}, Maharashtra`,
                        status: "APPROVED",
                        isActive: true,
                        referenceNo: user.referenceNo,
                        passwordHash: passwordHash,
                        initialPasswordSent: true
                    }
                });
                console.log(`[USER CREATED] ${user.name} (${user.email}) -> Status: APPROVED, Ref: ${user.referenceNo}`);
            }

            // 2. Create or Update PartnerLead / Submitted Loan File for Dashboard
            const commissionRate = 2.0;
            const commissionAmount = Number((user.applicationAmount * (commissionRate / 100)).toFixed(2));

            const existingLead = await prisma.partnerLead.findFirst({
                where: {
                    OR: [
                        { referenceNo: user.fileReferenceNo },
                        { customerEmail: user.email }
                    ]
                }
            });

            if (existingLead) {
                await prisma.partnerLead.update({
                    where: { id: existingLead.id },
                    data: {
                        partnerId: partner.id,
                        partnerReferenceNo: partner.referenceNo,
                        partnerName: partner.name,
                        partnerEmail: partner.email,
                        category: "loans",
                        subProduct: user.subProduct,
                        customerName: user.name,
                        customerMobile: user.mobile,
                        customerEmail: user.email,
                        customerCity: user.city,
                        bankName: user.bankName,
                        applicationAmount: user.applicationAmount,
                        commissionRate: commissionRate,
                        commissionAmount: commissionAmount,
                        leadStatus: "IN_PROCESS",
                        payoutStatus: "PENDING",
                        leadNotes: `Applied for ${user.subProduct} with ${user.bankName}`
                    }
                });
                console.log(`[LOAN FILE UPDATED] Ref: ${existingLead.referenceNo} for ${user.name} (${user.subProduct} - ₹${user.applicationAmount})`);
            } else {
                const createdLead = await prisma.partnerLead.create({
                    data: {
                        referenceNo: user.fileReferenceNo,
                        partnerId: partner.id,
                        partnerReferenceNo: partner.referenceNo,
                        partnerName: partner.name,
                        partnerEmail: partner.email,
                        category: "loans",
                        subProduct: user.subProduct,
                        customerName: user.name,
                        customerMobile: user.mobile,
                        customerEmail: user.email,
                        customerCity: user.city,
                        bankName: user.bankName,
                        rmName: "Sarvesh Bhoite",
                        applicationAmount: user.applicationAmount,
                        commissionRate: commissionRate,
                        commissionAmount: commissionAmount,
                        leadStatus: "IN_PROCESS",
                        payoutStatus: "PENDING",
                        leadNotes: `Applied for ${user.subProduct} with ${user.bankName}`
                    }
                });
                console.log(`[LOAN FILE CREATED] Ref: ${createdLead.referenceNo} for ${user.name} (${user.subProduct} - ₹${user.applicationAmount})`);
            }
        }

        console.log("\n=== ALL 3 USERS & LOAN FILES SEEDED SUCCESSFULLY! ===");
    } catch (err) {
        console.error("Error seeding users:", err);
    } finally {
        await prisma.$disconnect();
    }
}

seedThreeUsers();
