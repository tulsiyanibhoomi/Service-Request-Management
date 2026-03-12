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

    const activeStatuses = await prisma.service_request_status.findMany({
      where: {
        service_request_status_name: { in: ["Assigned", "In Progress"] },
      },
      select: { service_request_status_id: true },
    });

    const activeStatusIds = activeStatuses.map(
      (s) => s.service_request_status_id,
    );

    const data = await Promise.all(
      technicians.map(async (tech) => {
        const assignedRequestsCount = await prisma.service_request.count({
          where: {
            assigned_to_technician_id: tech.technician_id,
            service_request_status_id: { in: activeStatusIds },
          },
        });
        return {
          technicianId: tech.users.userid,
          max_requests_allowed: tech.max_requests_allowed,
          availability_status: tech.availability_status,
          departmentId: tech.service_dept_id,
          currently_assigned: assignedRequestsCount,
          ...tech.users,
        };
      }),
    );
    return NextResponse.json(data);
  } catch (err) {
    console.error("Technician List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
