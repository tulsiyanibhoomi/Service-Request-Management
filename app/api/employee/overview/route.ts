import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  const EMPLOYEE_ID = user.userid;

  try {
    const total = await prisma.service_request.count({
      where: {
        employee_id: EMPLOYEE_ID,
      },
    });

    const pending = await prisma.service_request.count({
      where: {
        employee_id: EMPLOYEE_ID,
        service_request_status: {
          service_request_status_name: "Pending",
        },
      },
    });

    const in_progress = await prisma.service_request.count({
      where: {
        employee_id: EMPLOYEE_ID,
        service_request_status: {
          service_request_status_name: "In Progress",
        },
      },
    });

    const completed = await prisma.service_request.count({
      where: {
        employee_id: EMPLOYEE_ID,
        service_request_status: {
          service_request_status_name: "Completed",
        },
      },
    });

    return NextResponse.json({
      total,
      pending,
      in_progress,
      completed,
    });
  } catch (err) {
    console.error("Employee Overview API error:", err);
    return NextResponse.json(
      { message: "Failed to load employee overview" },
      { status: 500 },
    );
  }
}
