import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: number } }) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { userid: Number(id) },
      include: {
        user_role: {
          select: {
            role: {
              select: { rolename: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = {
      userid: user.userid,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      created: user.created,
      modified: user.modified,
      role: user.user_role.map((ur) => ur.role.rolename).join(", "),
    };

    return NextResponse.json(userData);
  } catch (err) {
    console.error("User Details API error:", err);
    return NextResponse.json(
      { message: "Failed to fetch user details" },
      { status: 500 },
    );
  }
}
