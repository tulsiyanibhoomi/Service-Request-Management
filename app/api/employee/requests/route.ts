import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  const EMPLOYEE_ID = user.userid;

  try {
    const requests = await prisma.service_request.findMany({
      where: { employee_id: EMPLOYEE_ID },
      orderBy: { submitted_at: "desc" },
      select: {
        service_request_id: true,
        service_request_no: true,
        service_request_title: true,
        priority_level: true,
        service_request_status: {
          select: { service_request_status_name: true },
        },
        service_request_type: {
          select: { service_type_name: true },
        },
        submitted_at: true,
      },
    });

    const formatted = requests.map((req) => ({
      service_request_id: req.service_request_id,
      no: req.service_request_no,
      title: req.service_request_title,
      type: req.service_request_type.service_type_name,
      priority: req.priority_level,
      status: req.service_request_status.service_request_status_name,
      submitted_at: req.submitted_at,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Employee Requests API error:", err);
    return NextResponse.json(
      { message: "Failed to load employee requests" },
      { status: 500 },
    );
  }
}
