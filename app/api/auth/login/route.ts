// import { login } from "@/app/lib/auth";
// import { signToken } from "@/app/lib/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json();
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email or password are required" },
//         { status: 400 },
//       );
//     }
//     const result = await login(email, password);
//     if (!result.success || !result.user) {
//       return NextResponse.json(
//         { error: result.error || "Invalid credentials" },
//         { status: 401 },
//       );
//     }
//     const token = signToken({
//       id: result.user.id,
//       email: result.user.email,
//       role: result.user.role,
//     });
//     const response = NextResponse.json({
//       success: true,
//       user: {
//         id: result.user.id,
//         email: result.user.email,
//         role: result.user.role,
//       },
//     });
//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });
//     return response;
//   } catch (error) {
//     console.error("sign in error: ", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

import { login } from "@/app/lib/auth";
import { signToken } from "@/app/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log("Login attempt:", { email, password });
    console.log("Env:", {
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: process.env.JWT_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
    });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email or password are required" },
        { status: 400 },
      );
    }

    const result = await login(email, password);
    console.log("Login result:", result);

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
      sameSite: "lax", // changed to lax for testing cross-domain
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
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
