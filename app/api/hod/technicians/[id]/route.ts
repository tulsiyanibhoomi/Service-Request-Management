import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Department ID is required" },
        { status: 400 },
      );
    }

    const technicians = await prisma.technician.findMany({
      where: {
        service_dept_id: Number(id),
        users: { isactive: true },
      },
      include: {
        users: {
          select: {
            userid: true,
            username: true,
            fullname: true,
            email: true,
            isactive: true,
            user_role: {
              select: {
                role: {
                  select: { rolename: true },
                },
              },
            },
          },
        },
      },
    });

    const data = technicians.map((tech) => ({
      technicianId: tech.users.userid,
      max_requests_allowed: tech.max_requests_allowed,
      availability_status: tech.availability_status,
      departmentId: tech.service_dept_id,
      ...tech.users,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Technician List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
