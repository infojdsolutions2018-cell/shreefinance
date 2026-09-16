import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getAdminFromToken } from "@/lib/auth";

// GET /api/banners?page=home — public, no auth needed
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page");

        const where: Record<string, unknown> = { active: true };
        if (page) where.page = page;

        const banners = await prisma.banner.findMany({
            where,
            orderBy: [{ order: "asc" }, { createdAt: "desc" }]
        });
        return NextResponse.json({ banners });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

// POST /api/banners — requires admin auth
export async function POST(request: Request) {
    try {
        const admin = await getAdminFromToken();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("image") as File;
        const title = formData.get("title") as string;
        const link = (formData.get("link") as string) || "";
        const page = (formData.get("page") as string) || "home";

        if (!file || !title) {
            return NextResponse.json({ error: "Image and title are required" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { url, publicId } = await uploadToCloudinary(buffer, file.name);

        const lastBanner = await prisma.banner.findFirst({
            where: { page },
            orderBy: { order: "desc" }
        });
        const order = lastBanner ? lastBanner.order + 1 : 0;

        const banner = await prisma.banner.create({
            data: {
                imageUrl: url,
                publicId,
                title,
                link,
                page,
                order,
                active: true
            }
        });

        return NextResponse.json({ success: true, banner });
    } catch (error) {
        console.error("Error creating banner:", error);
        return NextResponse.json({ error: "Failed to upload banner" }, { status: 500 });
    }
}
