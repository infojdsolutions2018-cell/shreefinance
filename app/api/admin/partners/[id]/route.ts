import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromToken } from "@/lib/auth";
import { sendPartnerApprovalEmail, sendPartnerRejectionEmail } from "@/lib/mail";

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
        const { action, rejectionReason } = body;

        if (!action || !["APPROVE", "REJECT"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Must be 'APPROVE' or 'REJECT'" },
                { status: 400 }
            );
        }

        const application = await prisma.partnerApplication.findUnique({
            where: { id }
        });

        if (!application) {
            return NextResponse.json({ error: "Partner application not found" }, { status: 404 });
        }

        const isApproved = action === "APPROVE";
        const newStatus = isApproved ? "APPROVED" : "REJECTED";

        let generatedPassword = "";
        let passwordHash = application.passwordHash;
        let initialPasswordSent = application.initialPasswordSent;

        if (isApproved) {
            const randomDigits = Math.floor(100000 + Math.random() * 900000);
            generatedPassword = `Shree@${randomDigits}`;
            const bcrypt = (await import("bcryptjs")).default;
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(generatedPassword, salt);
            initialPasswordSent = true;
        }

        const updated = await prisma.partnerApplication.update({
            where: { id },
            data: {
                status: newStatus,
                isActive: isApproved,
                reviewedAt: new Date(),
                reviewedBy: admin.username || "admin",
                ...(passwordHash ? { passwordHash } : {}),
                initialPasswordSent,
                ...(!isApproved && rejectionReason ? { rejectionReason } : {})
            }
        });

        // Send Email notification to user
        try {
            if (isApproved) {
                await sendPartnerApprovalEmail({
                    email: updated.email,
                    name: updated.name,
                    referenceNo: updated.referenceNo,
                    password: generatedPassword,
                    companyName: updated.companyName || undefined
                });
            } else {
                await sendPartnerRejectionEmail({
                    email: updated.email,
                    name: updated.name,
                    referenceNo: updated.referenceNo
                }, rejectionReason || "Application criteria requirements not met.");
            }
        } catch (emailErr) {
            console.error("Failed to send partner status email:", emailErr);
        }

        return NextResponse.json({
            success: true,
            message: `Partner application ${isApproved ? "approved" : "rejected"} successfully`,
            partner: updated
        });
    } catch (error) {
        console.error("Error updating partner status:", error);
        return NextResponse.json({ error: "Failed to update partner application" }, { status: 500 });
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

        await prisma.partnerApplication.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: "Partner application deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting partner application:", error);
        return NextResponse.json({ error: "Failed to delete partner application" }, { status: 500 });
    }
}
