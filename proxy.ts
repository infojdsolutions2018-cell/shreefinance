import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes (except /admin/login)
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const token = request.cookies.get("admin_token")?.value;
        if (!token) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    const response = NextResponse.next();
    response.headers.set("x-next-pathname", pathname);
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
