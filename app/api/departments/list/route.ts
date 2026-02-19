import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dept = await prisma.service_dept.findMany({
      where: { isactive: true },
      select: {
        service_dept_id: true,
        service_dept_name: true,
        description: true,
        cc_email_to_csv: true,
        isactive: true,
        userid: true,
        users: {
          select: {
            username: true,
          },
        },
        created: true,
        modified: true,
      },
    });

    const data = dept.map((d) => ({
      ...d,
      username: d.users?.username ?? "",
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Dept List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
