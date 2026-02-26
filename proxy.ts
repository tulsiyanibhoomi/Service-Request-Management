import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/jwt";

export function proxy(req: NextRequest) {
  const PUBLIC_ROUTES = ["/", "/auth/login"];
  const AUTH_PAGES = ["/auth/login"];

  const path = req.nextUrl.pathname;

  const token = req.cookies.get("token")?.value;

  const payload = token ? verifyToken(token) : null;

  const role = payload?.role?.toLowerCase();

  if (!payload && PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  if (payload && (AUTH_PAGES.includes(path) || path === "/")) {
    const url = req.nextUrl.clone();

    switch (role) {
      case "admin":
        url.pathname = "/admin/dashboard";
        break;
      case "employee":
        url.pathname = "/employee/dashboard";
        break;
      case "hod":
        url.pathname = "/hod/dashboard";
        break;
      case "technician":
        url.pathname = "/technician/dashboard";
        break;
      default:
        url.pathname = "/";
    }

    return NextResponse.redirect(url);
  }

  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";

    const res = NextResponse.redirect(url);
    res.cookies.set({
      name: "flashMessage",
      value: "You must login to access this page",
      maxAge: 10,
      httpOnly: false,
      path: "/",
    });

    return res;
  }

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  if (path.startsWith("/employee") && role !== "employee") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  if (path.startsWith("/hod") && role !== "hod") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  if (path.startsWith("/technician") && role !== "technician") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/admin/:path*",
    "/employee/:path*",
    "/hod/:path*",
    "/technician/:path*",
  ],
};
