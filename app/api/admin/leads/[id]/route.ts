import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromToken } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromToken();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { leadStatus, payoutStatus, commissionRate, applicationAmount, disbursedAmount, leadNotes } = body;

        const lead = await prisma.partnerLead.findUnique({ where: { id } });
        if (!lead) {
            return NextResponse.json({ error: "File record not found" }, { status: 404 });
        }

        const nextAppAmount = applicationAmount !== undefined && !isNaN(Number(applicationAmount))
            ? Number(applicationAmount)
            : lead.applicationAmount;

        const nextDisbursedAmount = disbursedAmount !== undefined && !isNaN(Number(disbursedAmount))
            ? Number(disbursedAmount)
            : lead.disbursedAmount;

        const nextCommissionRate = commissionRate !== undefined && !isNaN(Number(commissionRate))
            ? Number(commissionRate)
            : lead.commissionRate;

        const baseAmount = nextDisbursedAmount || nextAppAmount;
        const nextCommissionAmount = Number((baseAmount * (nextCommissionRate / 100)).toFixed(2));

        const updated = await prisma.partnerLead.update({
            where: { id },
            data: {
                ...(leadStatus ? { leadStatus } : {}),
                ...(leadStatus === "DISBURSED" && !lead.disbursedAt ? { disbursedAt: new Date() } : {}),
                ...(payoutStatus ? { payoutStatus } : {}),
                applicationAmount: nextAppAmount,
                disbursedAmount: nextDisbursedAmount,
                commissionRate: nextCommissionRate,
                commissionAmount: nextCommissionAmount,
                ...(leadNotes !== undefined ? { leadNotes } : {})
            }
        });

        return NextResponse.json({
            success: true,
            message: "Lead file updated successfully",
            lead: updated
        });
    } catch (error) {
        console.error("Error updating lead file:", error);
        return NextResponse.json({ error: "Failed to update lead file" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromToken();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.partnerLead.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: "Lead file deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting lead file:", error);
        return NextResponse.json({ error: "Failed to delete lead file" }, { status: 500 });
    }
}
