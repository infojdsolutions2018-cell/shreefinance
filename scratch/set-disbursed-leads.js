const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const fs = require("fs");

const envFile = fs.readFileSync(".env.local", "utf8");
const match = envFile.match(/DATABASE_URL=["']?(.*?)["']?(\r?\n|$)/);
const connectionString = match ? match[1].trim() : process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function setDisbursedLeads() {
    try {
        console.log("Updating leads to DISBURSED status...");

        // Update Akash Jadhav (Car Loan - ₹50,000)
        await prisma.partnerLead.updateMany({
            where: { customerEmail: "aakasharunjadhav@gmail.com" },
            data: {
                leadStatus: "DISBURSED",
                payoutStatus: "PROCESSED",
                disbursedAmount: 50000,
                disbursedAt: new Date(),
                bankReferenceNo: "HDFC-DISB-78912"
            }
        });

        // Update Atharva Patharkar (Education Loan - ₹70,000)
        await prisma.partnerLead.updateMany({
            where: { customerEmail: "atharva@gmail.com" },
            data: {
                leadStatus: "DISBURSED",
                payoutStatus: "PAID",
                disbursedAmount: 70000,
                disbursedAt: new Date(),
                bankReferenceNo: "SBI-DISB-45231"
            }
        });

        // Update Aishwarya Sulagadle (Home Loan - ₹80,000)
        await prisma.partnerLead.updateMany({
            where: { customerEmail: "sulagadleaishwarya@gmail.com" },
            data: {
                leadStatus: "DISBURSED",
                payoutStatus: "PAID",
                disbursedAmount: 80000,
                disbursedAt: new Date(),
                bankReferenceNo: "BOM-DISB-99881"
            }
        });

        const leads = await prisma.partnerLead.findMany({
            where: { leadStatus: "DISBURSED" },
            select: { customerName: true, subProduct: true, applicationAmount: true, commissionAmount: true, leadStatus: true }
        });

        console.log("Updated Disbursed Leads:", leads);

        const totalDisbursed = leads.reduce((sum, l) => sum + (l.applicationAmount || 0), 0);
        const totalCommissions = leads.reduce((sum, l) => sum + (l.commissionAmount || 0), 0);

        console.log(`\nTotal Disbursed Volume: ₹${totalDisbursed} (₹${(totalDisbursed / 100000).toFixed(1)} Lakhs)`);
        console.log(`Total Commissions: ₹${totalCommissions}`);

    } catch (err) {
        console.error("Error setting disbursed leads:", err);
    } finally {
        await prisma.$disconnect();
    }
}

setDisbursedLeads();
