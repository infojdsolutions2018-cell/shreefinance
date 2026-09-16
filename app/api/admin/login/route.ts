import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();

        // Check if admin exists in PostgreSQL via Prisma
        let admin = await prisma.admin.findFirst({
            where: {
                username: {
                    equals: cleanUser,
                    mode: "insensitive"
                }
            }
        });

        // Seeded or hardcoded matches
        const isMasterCreds = (cleanUser === "shreefinance@gmail.com" || cleanUser === "shreefinancec@gmail.com" || cleanUser === "admin") && (cleanPass === "shree123" || cleanPass === "admin123");

        // If admin doesn't exist, auto-create
        if (!admin && isMasterCreds) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(cleanPass, salt);
            admin = await prisma.admin.create({
                data: {
                    username: cleanUser,
                    passwordHash
                }
            });
        }

        let isMatch = false;
        if (admin && admin.passwordHash) {
            isMatch = await bcrypt.compare(cleanPass, admin.passwordHash);
        }

        // Fallback for master credentials
        if (!isMatch && isMasterCreds) {
            isMatch = true;
        }

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const adminId = admin?.id || "admin_master";
        const adminUsername = admin?.username || cleanUser;
        const token = signToken({ id: adminId, username: adminUsername });

        const response = NextResponse.json({
            message: "Login successful",
            admin: { id: adminId, username: adminUsername },
        });

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
