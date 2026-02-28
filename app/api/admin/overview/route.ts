import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const total = await prisma.service_request.count();
    const pending = await prisma.service_request.count({
      where: {
        service_request_status: {
          service_request_status_name: "Pending",
        },
      },
    });
    const in_progress = await prisma.service_request.count({
      where: {
        service_request_status: {
          service_request_status_name: "In Progress",
        },
      },
    });
    const completed = await prisma.service_request.count({
      where: {
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
    console.error("Overview API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
