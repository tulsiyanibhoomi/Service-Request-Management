import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const departments = await prisma.service_dept.findMany({
      where: { isactive: true },
      select: {
        service_dept_id: true,
        service_dept_name: true,
        description: true,
        cc_email_to_csv: true,
        service_dept_person: {
          where: { is_hod: true },
          select: {
            users: {
              select: {
                fullname: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    const formattedDepartments = departments.map((dept) => ({
      id: dept.service_dept_id,
      name: dept.service_dept_name,
      description: dept.description,
      email: dept.cc_email_to_csv,
      hod: dept.service_dept_person[0]?.users.fullname ?? null,
    }));

    return NextResponse.json(formattedDepartments);
  } catch (err) {
    console.error("Dept List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
