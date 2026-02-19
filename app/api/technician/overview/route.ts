import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  const TECHNICIAN_ID = user.userid;

  try {
    const total = await prisma.service_request.count({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
      },
    });
    const assigned = await prisma.service_request.count({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
        service_request_status: {
          service_request_status_name: "Approved",
        },
      },
    });
    const in_progress = await prisma.service_request.count({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
        service_request_status: {
          service_request_status_name: "In Progress",
        },
      },
    });
    const completed = await prisma.service_request.count({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
        service_request_status: {
          service_request_status_name: "Completed",
        },
      },
    });

    return NextResponse.json({
      total,
      assigned,
      in_progress,
      completed,
    });
  } catch (err) {
    console.error("Technician Overview API error:", err);
    return NextResponse.json(
      { message: "Failed to load Technician overview" },
      { status: 500 },
    );
  }
}
