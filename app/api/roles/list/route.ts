import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      where: {
        isactive: true,
      },
    });

    return NextResponse.json(roles);
  } catch (err) {
    console.error("Users List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
