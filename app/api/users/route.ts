import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      include: {
        user_role: {
          select: {
            role: {
              select: {
                rolename: true,
              },
            },
          },
        },
      },
      where: {
        isactive: true,
      },
    });

    const data = users.map((user) => ({
      ...user,
      roles: user.user_role.map((ur) => ur.role.rolename).join(", "),
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Users List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
