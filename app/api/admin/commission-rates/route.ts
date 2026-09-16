import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromToken } from "@/lib/auth";

// GET global commission rates
export async function GET() {
    try {
        let settings = await prisma.systemSettings.findFirst();
        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    loansCommissionRate: 2.0,
                    cardsCommissionRate: 3.0,
                    insuranceCommissionRate: 5.0,
                    investmentsCommissionRate: 1.5,
                    productRates: {
                        "Home Loan": 2.0,
                        "Personal Loan": 2.5,
                        "Business Loan": 2.5,
                        "Loan Against Property": 1.75,
                        "Car Loan": 1.5,
                        "Credit Card": 3.0,
                        "Business Card": 3.5,
                        "Health Insurance": 5.0,
                        "Life Insurance": 6.0,
                        "Vehicle Insurance": 4.0,
                        "Mutual Funds": 1.5,
                        "Stocks": 1.0,
                        "Fixed Deposits": 0.75
                    }
                }
            });
        }

        return NextResponse.json({
            success: true,
            settings: {
                loansCommissionRate: settings.loansCommissionRate,
                cardsCommissionRate: settings.cardsCommissionRate,
                insuranceCommissionRate: settings.insuranceCommissionRate,
                investmentsCommissionRate: settings.investmentsCommissionRate,
                productRates: settings.productRates,
                updatedAt: settings.updatedAt
            }
        });
    } catch (error) {
        console.error("Fetch commission rates error:", error);
        return NextResponse.json({ error: "Failed to fetch commission rates" }, { status: 500 });
    }
}

// UPDATE commission rates (Admin only)
export async function PUT(req: Request) {
    try {
        const admin = await getAdminFromToken();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            loansCommissionRate,
            cardsCommissionRate,
            insuranceCommissionRate,
            investmentsCommissionRate,
            productRates
        } = body;

        let settings = await prisma.systemSettings.findFirst();
        if (settings) {
            settings = await prisma.systemSettings.update({
                where: { id: settings.id },
                data: {
                    ...(loansCommissionRate !== undefined ? { loansCommissionRate: Number(loansCommissionRate) } : {}),
                    ...(cardsCommissionRate !== undefined ? { cardsCommissionRate: Number(cardsCommissionRate) } : {}),
                    ...(insuranceCommissionRate !== undefined ? { insuranceCommissionRate: Number(insuranceCommissionRate) } : {}),
                    ...(investmentsCommissionRate !== undefined ? { investmentsCommissionRate: Number(investmentsCommissionRate) } : {}),
                    ...(productRates ? { productRates } : {}),
                    updatedBy: admin.username || "admin"
                }
            });
        } else {
            settings = await prisma.systemSettings.create({
                data: {
                    loansCommissionRate: loansCommissionRate !== undefined ? Number(loansCommissionRate) : 2.0,
                    cardsCommissionRate: cardsCommissionRate !== undefined ? Number(cardsCommissionRate) : 3.0,
                    insuranceCommissionRate: insuranceCommissionRate !== undefined ? Number(insuranceCommissionRate) : 5.0,
                    investmentsCommissionRate: investmentsCommissionRate !== undefined ? Number(investmentsCommissionRate) : 1.5,
                    productRates: productRates || {},
                    updatedBy: admin.username || "admin"
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Commission rates updated successfully",
            settings
        });
    } catch (error) {
        console.error("Update commission rates error:", error);
        return NextResponse.json({ error: "Failed to update commission rates" }, { status: 500 });
    }
}
