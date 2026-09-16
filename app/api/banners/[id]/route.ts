import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { getAdminFromToken } from "@/lib/auth";

// DELETE /api/banners/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromToken();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const banner = await prisma.banner.findUnique({ where: { id } });
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        // Delete from Cloudinary
        try {
            await deleteFromCloudinary(banner.publicId);
        } catch (e) {
            console.warn("Failed to delete banner from Cloudinary:", e);
        }

        // Delete from PostgreSQL
        await prisma.banner.delete({ where: { id } });

        return NextResponse.json({ message: "Banner deleted successfully" });
    } catch (error) {
        console.error("Error deleting banner:", error);
        return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
    }
}
