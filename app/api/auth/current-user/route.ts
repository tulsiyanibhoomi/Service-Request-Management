import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let departmentName: string | null = null;

    if (user.role === "HOD" || user.role === "Technician") {
      const deptPerson = await prisma.service_dept_person.findFirst({
        where: { userid: user.id },
        select: { service_dept_id: true },
      });

      if (deptPerson?.service_dept_id) {
        const dept = await prisma.service_dept.findUnique({
          where: { service_dept_id: deptPerson.service_dept_id },
          select: { service_dept_name: true },
        });
        departmentName = dept?.service_dept_name || null;
      }
    }

    return NextResponse.json(
      { user: { ...user, departmentName } },
      { status: 200 },
    );
  } catch (err) {
    console.error("current-user API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 },
    );
  }
}
