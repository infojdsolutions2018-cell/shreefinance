import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromToken } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const admin = await getAdminFromToken();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        // Build Prisma where filter
        const where: Record<string, unknown> = {};

        if (status && status !== "ALL") {
            where.status = status.toUpperCase();
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { mobile: { contains: search, mode: "insensitive" } },
                { referenceNo: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
            ];
        }

        const partners = await prisma.partnerApplication.findMany({
            where,
            orderBy: { createdAt: "desc" }
        });

        // Calculate summary counts for admin metrics
        const total = await prisma.partnerApplication.count();
        const pending = await prisma.partnerApplication.count({ where: { status: "PENDING" } });
        const approved = await prisma.partnerApplication.count({ where: { status: "APPROVED" } });
        const rejected = await prisma.partnerApplication.count({ where: { status: "REJECTED" } });

        return NextResponse.json({
            success: true,
            partners,
            counts: {
                total,
                pending,
                approved,
                rejected
            }
        });
    } catch (error) {
        console.error("Error fetching partner applications via Prisma:", error);
        return NextResponse.json({
            success: true,
            partners: [],
            counts: {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0
            },
            error: "Failed to fetch partners from PostgreSQL"
        }, { status: 500 });
    }
}
