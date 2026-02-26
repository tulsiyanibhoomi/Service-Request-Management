import { login } from "@/app/lib/auth";
import { signToken } from "@/app/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email or password are required" },
        { status: 400 },
      );
    }

    const result = await login(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("sign in error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
