import { NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, SessionData } from "@/app/lib/auth"
import type { IronSession } from "iron-session"
import { cookies } from "next/headers"

export async function proxy(req: NextRequest) {

    const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"]
    const AUTH_PAGES = ["/auth/login", "/auth/signup"]

    let session: IronSession<SessionData> | null = null

    try {
        const cookieStore = await cookies()
        session = await getIronSession<SessionData>(
            cookieStore,
            sessionOptions
        )
    } catch (err) {
        console.error("Session error", err)
    }

    const path = req.nextUrl.pathname
    const role = session?.role?.toLowerCase()

    if (!session?.isLoggedIn && PUBLIC_ROUTES.includes(path)) {
        return NextResponse.next()
    }

    if (session?.isLoggedIn && (AUTH_PAGES.includes(path) || path === "/")) {
        const url = req.nextUrl.clone()

        switch (role) {
            case "admin":
                url.pathname = "/admin/dashboard"
                break
            case "employee":
                url.pathname = "/employee/dashboard"
                break
            case "hod":
                url.pathname = "/hod/dashboard"
                break
            default:
                url.pathname = "/"
        }

        return NextResponse.redirect(url)
    }

    if (!session?.isLoggedIn) {
        const url = req.nextUrl.clone()
        url.pathname = "/auth/login"
        const res = NextResponse.redirect(url)
        res.cookies.set({
            name: "flashMessage",
            value: "You must login to access this page",
            maxAge: 10,
            httpOnly: false,
            path: "/",
        })
        return res
    }

    if (path.startsWith("/admin") && role !== "admin") {
        const url = req.nextUrl.clone()
        url.pathname = "/403"
        return NextResponse.rewrite(url)
    }

    if (path.startsWith("/employee") && role !== "employee") {
        const url = req.nextUrl.clone()
        url.pathname = "/403"
        return NextResponse.rewrite(url)
    }

    if (path.startsWith("/hod") && role !== "hod") {
        const url = req.nextUrl.clone()
        url.pathname = "/403"
        return NextResponse.rewrite(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/auth/:path*",
        "/admin/:path*",
        "/employee/:path*",
        "/hod/:path*",
    ],
}