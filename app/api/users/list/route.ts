import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        userid: true,
        fullname: true,
        email: true,
        isactive: true,
        created: true,
        modified: true,
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
