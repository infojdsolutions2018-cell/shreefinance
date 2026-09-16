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
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const partnerId = searchParams.get("partnerId");
        const partnerRef = searchParams.get("partnerRef");
        const district = searchParams.get("district") || searchParams.get("city");

        const where: Record<string, unknown> = {};

        if (partnerId && partnerId !== "ALL") {
            where.partnerId = partnerId;
        } else if (partnerRef && partnerRef !== "ALL") {
            where.partnerReferenceNo = partnerRef;
        }

        if (status && status !== "ALL") {
            where.leadStatus = status;
        }

        if (category && category !== "ALL") {
            where.category = category;
        }

        if (district && district !== "ALL") {
            where.customerCity = { contains: district.trim(), mode: "insensitive" };
        }

        if (search && search.trim()) {
            where.OR = [
                { customerName: { contains: search.trim(), mode: "insensitive" } },
                { customerMobile: { contains: search.trim(), mode: "insensitive" } },
                { partnerName: { contains: search.trim(), mode: "insensitive" } },
                { partnerReferenceNo: { contains: search.trim(), mode: "insensitive" } },
                { bankName: { contains: search.trim(), mode: "insensitive" } },
                { referenceNo: { contains: search.trim(), mode: "insensitive" } },
                { subProduct: { contains: search.trim(), mode: "insensitive" } }
            ];
        }

        const leads = await prisma.partnerLead.findMany({
            where,
            orderBy: { createdAt: "desc" }
        });

        const allLeads = await prisma.partnerLead.findMany({});

        const hasStrictlyDisbursed = allLeads.some(l => l.leadStatus === "DISBURSED");

        const globalTotalCount = allLeads.length;
        const globalInProcessCount = allLeads.filter(l => ["IN_PROCESS", "DOCS_SUBMITTED", "BANK_LOGIN", "SANCTIONED"].includes(l.leadStatus)).length;
        const globalDisbursedCount = hasStrictlyDisbursed
            ? allLeads.filter(l => l.leadStatus === "DISBURSED").length
            : allLeads.length;
        const globalTotalFiledVolume = allLeads.reduce((sum, l) => sum + (l.applicationAmount || 0), 0);
        const globalTotalDisbursedVolume = hasStrictlyDisbursed
            ? allLeads.filter(l => l.leadStatus === "DISBURSED").reduce((sum, l) => sum + (l.disbursedAmount || l.applicationAmount || 0), 0)
            : globalTotalFiledVolume;
        const globalTotalCommissions = hasStrictlyDisbursed
            ? Number(allLeads.filter(l => l.leadStatus === "DISBURSED").reduce((sum, l) => sum + (l.commissionAmount || 0), 0).toFixed(2))
            : Number(allLeads.reduce((sum, l) => sum + (l.commissionAmount || ((l.applicationAmount || 0) * ((l.commissionRate || 2.0) / 100))), 0).toFixed(2));
        const globalPendingPayoutCommissions = Number(allLeads
            .filter(l => l.payoutStatus !== "PAID")
            .reduce((sum, l) => sum + (l.commissionAmount || ((l.applicationAmount || 0) * ((l.commissionRate || 2.0) / 100))), 0).toFixed(2));

        const targetLeads = (partnerId && partnerId !== "ALL") || (partnerRef && partnerRef !== "ALL")
            ? allLeads.filter(l => (partnerId && partnerId !== "ALL" ? String(l.partnerId) === String(partnerId) || l.partnerReferenceNo === partnerId : l.partnerReferenceNo === partnerRef))
            : allLeads;

        const targetHasDisbursed = targetLeads.some(l => l.leadStatus === "DISBURSED");
        const totalCount = targetLeads.length;
        const inProcessCount = targetLeads.filter(l => ["IN_PROCESS", "DOCS_SUBMITTED", "BANK_LOGIN", "SANCTIONED"].includes(l.leadStatus)).length;
        const disbursedCount = targetHasDisbursed
            ? targetLeads.filter(l => l.leadStatus === "DISBURSED").length
            : targetLeads.length;
        const totalFiledVolume = targetLeads.reduce((sum, l) => sum + (l.applicationAmount || 0), 0);
        const totalDisbursedVolume = targetHasDisbursed
            ? targetLeads.filter(l => l.leadStatus === "DISBURSED").reduce((sum, l) => sum + (l.disbursedAmount || l.applicationAmount || 0), 0)
            : totalFiledVolume;
        const totalCommissions = targetHasDisbursed
            ? Number(targetLeads.filter(l => l.leadStatus === "DISBURSED").reduce((sum, l) => sum + (l.commissionAmount || 0), 0).toFixed(2))
            : Number(targetLeads.reduce((sum, l) => sum + (l.commissionAmount || ((l.applicationAmount || 0) * ((l.commissionRate || 2.0) / 100))), 0).toFixed(2));
        const pendingPayoutCommissions = Number(targetLeads
            .filter(l => l.payoutStatus !== "PAID")
            .reduce((sum, l) => sum + (l.commissionAmount || ((l.applicationAmount || 0) * ((l.commissionRate || 2.0) / 100))), 0).toFixed(2));

        return NextResponse.json({
            success: true,
            leads,
            metrics: {
                totalCount,
                inProcessCount,
                disbursedCount,
                totalFiledVolume,
                totalDisbursedVolume,
                totalCommissions,
                pendingPayoutCommissions,
                globalTotalCount,
                globalInProcessCount,
                globalDisbursedCount,
                globalTotalFiledVolume,
                globalTotalDisbursedVolume,
                globalTotalCommissions,
                globalPendingPayoutCommissions
            }
        });
    } catch (error) {
        console.error("Admin fetch leads error:", error);
        return NextResponse.json({
            leads: [],
            metrics: {
                totalCount: 0,
                inProcessCount: 0,
                disbursedCount: 0,
                totalFiledVolume: 0,
                totalDisbursedVolume: 0,
                totalCommissions: 0,
                pendingPayoutCommissions: 0,
                globalTotalCount: 0,
                globalInProcessCount: 0,
                globalDisbursedCount: 0,
                globalTotalFiledVolume: 0,
                globalTotalDisbursedVolume: 0,
                globalTotalCommissions: 0,
                globalPendingPayoutCommissions: 0
            },
            error: "Failed to fetch leads from PostgreSQL"
        }, { status: 500 });
    }
}
