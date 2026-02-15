import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.isLoggedIn) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { id, fullname, username, email, role } = session;

    return NextResponse.json({
      user: { id, fullname, username, email, role },
    });
  } catch (err) {
    console.error("current-user API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 },
    );
  }
}
