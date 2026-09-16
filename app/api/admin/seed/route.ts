import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        const username = "shreefinance@gmail.com";
        const password = "shree123";

        // Check if admin already exists
        const existing = await prisma.admin.findUnique({
            where: { username }
        });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        if (existing) {
            await prisma.admin.update({
                where: { username },
                data: { passwordHash }
            });
            return NextResponse.json({ message: "Admin password updated successfully" }, { status: 200 });
        }

        await prisma.admin.create({
            data: {
                username,
                passwordHash
            }
        });

        return NextResponse.json({ message: "Admin user created successfully in PostgreSQL" }, { status: 201 });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
    }
}
