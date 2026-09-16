import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromToken } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET /api/blogs/[id] — Public fetch single blog post by slug or ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        let blog = await prisma.blog.findUnique({ where: { slug: id } });
        if (!blog) {
            blog = await prisma.blog.findUnique({ where: { id } }).catch(() => null);
        }

        if (!blog) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        // Increment view count
        const updatedBlog = await prisma.blog.update({
            where: { id: blog.id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (error) {
        console.error("Error fetching single blog:", error);
        return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
    }
}

// PATCH /api/blogs/[id] — Admin only update
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

        const formData = await req.formData();
        const title = formData.get("title") as string | null;
        const excerpt = formData.get("excerpt") as string | null;
        const content = formData.get("content") as string | null;
        const category = formData.get("category") as string | null;
        const author = formData.get("author") as string | null;
        const authorRole = formData.get("authorRole") as string | null;
        const readTime = formData.get("readTime") as string | null;
        const tagsRaw = formData.get("tags") as string | null;
        const published = formData.get("published") !== null ? formData.get("published") === "true" : undefined;
        const imageFile = formData.get("image") as File | null;
        let coverImageUrl = formData.get("coverImageUrl") as string | null;

        const existing = await prisma.blog.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await uploadToCloudinary(buffer, imageFile.name);
            coverImageUrl = uploadResult.url;
        }

        const updateData: Record<string, unknown> = {};
        if (title) updateData.title = title;
        if (excerpt) updateData.excerpt = excerpt;
        if (content) updateData.content = content;
        if (category) updateData.category = category;
        if (author) updateData.author = author;
        if (authorRole) updateData.authorRole = authorRole;
        if (readTime) updateData.readTime = readTime;
        if (published !== undefined) updateData.published = published;
        if (coverImageUrl !== null && coverImageUrl !== undefined) updateData.coverImage = coverImageUrl;

        if (tagsRaw !== null && tagsRaw !== undefined) {
            updateData.tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
        }

        const blog = await prisma.blog.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
    }
}

// DELETE /api/blogs/[id] — Admin only delete
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

        await prisma.blog.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
    }
}
