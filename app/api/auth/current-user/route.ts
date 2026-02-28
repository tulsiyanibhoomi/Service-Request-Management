import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("current-user API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 },
    );
  }
}
