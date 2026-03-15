import { decodeId } from "@/app/components/utils/url";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const numericId = decodeId(id);

  if (!numericId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { userid: Number(numericId) },
      include: {
        user_role: {
          include: {
            role: true,
          },
        },
        technician: true,
        service_dept_person: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const roles = user.user_role.map((ur) => ur.role.rolename);

    let statistics: any = {};

    let serviceDeptId: number | null = null;
    let departmentName: string | null = null;
    let maxRequestsAllowed: number | null = null;

    if (roles.includes("Technician") && user.technician) {
      const technicianId = user.userid;
      const completedRequests = await prisma.service_request.count({
        where: {
          assigned_to_technician_id: technicianId,
          service_request_status: {
            service_request_status_name: "Completed",
          },
        },
      });

      const closedRequests = await prisma.service_request.count({
        where: {
          assigned_to_technician_id: technicianId,
          service_request_status: {
            service_request_status_name: "Closed",
          },
        },
      });

      const activeRequests = await prisma.service_request.count({
        where: {
          assigned_to_technician_id: technicianId,
          service_request_status: {
            service_request_status_name: "In Progress",
          },
        },
      });

      const approvedRequests = await prisma.service_request.count({
        where: {
          assigned_to_technician_id: technicianId,
          service_request_status: {
            service_request_status_name: "Approved",
          },
        },
      });

      const avgCompletion = await prisma.$queryRaw<{ avgDays: number }[]>`
        SELECT AVG(DATEDIFF(srsh.changed_at, sr.submitted_at)) as avgDays
        FROM service_request sr
        JOIN service_request_status_history srsh 
          ON sr.service_request_id = srsh.request_id
        JOIN service_request_status srs
          ON srsh.status_id = srs.service_request_status_id
        WHERE sr.assigned_to_technician_id = ${technicianId}
          AND srs.service_request_status_name = 'Closed'
      `;

      statistics = {
        completedRequests,
        closedRequests,
        activeRequests,
        approvedRequests,
        maxAllowedRequests: user.technician.max_requests_allowed,
        averageCompletionDays: avgCompletion[0]?.avgDays || 0,
      };

      const dept = user.technician.service_dept_id
        ? await prisma.service_dept.findUnique({
            where: { service_dept_id: user.technician.service_dept_id },
          })
        : null;

      serviceDeptId = dept?.service_dept_id ?? null;
      departmentName = dept?.service_dept_name ?? null;
      maxRequestsAllowed = user.technician.max_requests_allowed ?? null;
    }

    if (roles.includes("Employee")) {
      const totalRequests = await prisma.service_request.count({
        where: { employee_id: user.userid },
      });

      const pendingRequests = await prisma.service_request.count({
        where: {
          employee_id: user.userid,
          service_request_status: {
            service_request_status_name: "Pending",
          },
        },
      });
      const activeRequests = await prisma.service_request.count({
        where: {
          employee_id: user.userid,
          service_request_status: {
            service_request_status_name: {
              in: ["In Progress", "Approved"],
            },
          },
        },
      });
      const cancelledRequests = await prisma.service_request.count({
        where: {
          employee_id: user.userid,
          service_request_status: {
            service_request_status_name: "Cancelled",
          },
        },
      });
      const completedRequests = await prisma.service_request.count({
        where: {
          employee_id: user.userid,
          service_request_status: {
            service_request_status_name: "Completed",
          },
        },
      });
      const declinedRequests = await prisma.service_request.count({
        where: {
          employee_id: user.userid,
          service_request_status: {
            service_request_status_name: "Declined",
          },
        },
      });
      const closedRequests = await prisma.service_request.count({
        where: {
          employee_id: user.userid,
          service_request_status: {
            service_request_status_name: "Closed",
          },
        },
      });

      statistics = {
        totalRequests,
        pendingRequests,
        activeRequests,
        cancelledRequests,
        declinedRequests,
        completedRequests,
        closedRequests,
      };
    }

    const hodDept = Array.isArray(user.service_dept_person)
      ? user.service_dept_person.find((d) => d.is_hod)
      : user.service_dept_person?.is_hod
        ? user.service_dept_person
        : undefined;
    if (roles.includes("HOD") && hodDept) {
      const deptId = hodDept.service_dept_id;

      const totalDeptRequests = await prisma.service_request.count({
        where: {
          service_request_type: {
            dept_id: deptId,
          },
          service_request_status: {
            service_request_status_name: {
              not: "Cancelled",
            },
          },
        },
      });

      const pendingRequests = await prisma.service_request.count({
        where: {
          service_request_status: {
            service_request_status_name: "Pending",
          },
          service_request_type: {
            dept_id: deptId,
          },
        },
      });

      const activeRequests = await prisma.service_request.count({
        where: {
          service_request_status: {
            service_request_status_name: {
              in: ["In Progress", "Approved"],
            },
          },
          service_request_type: {
            dept_id: deptId,
          },
        },
      });

      const declinedRequests = await prisma.service_request.count({
        where: {
          service_request_status: {
            service_request_status_name: "Declined",
          },
          service_request_type: {
            dept_id: deptId,
          },
        },
      });

      const completedRequests = await prisma.service_request.count({
        where: {
          service_request_status: {
            service_request_status_name: "Completed",
          },
          service_request_type: {
            dept_id: deptId,
          },
        },
      });

      const closedRequests = await prisma.service_request.count({
        where: {
          service_request_status: {
            service_request_status_name: "Closed",
          },
          service_request_type: {
            dept_id: deptId,
          },
        },
      });

      const technicianCount = await prisma.technician.count({
        where: { service_dept_id: deptId, users: { isactive: true } },
      });

      const dept = await prisma.service_dept.findUnique({
        where: { service_dept_id: deptId },
      });

      departmentName = dept?.service_dept_name ?? null;

      statistics = {
        totalDeptRequests,
        declinedRequests,
        completedRequests,
        closedRequests,
        activeRequests,
        pendingRequests,
        technicianCount,
      };
    }

    const userData = {
      userid: user.userid,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      created: user.created,
      role: roles.join(", "),
      statistics,
      serviceDeptId,
      departmentName,
      maxRequestsAllowed,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("User Details API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user details" },
      { status: 500 },
    );
  }
}
