import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const status = await prisma.service_request_status.findMany({
      include: {
        _count: {
          select: { service_request: true },
        },
      },
    });

    const data = status.map((r) => ({
      id: r.service_request_status_id,
      status_name: r.service_request_status_name,
      description: r.description,
      request_count: r._count.service_request,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Service Request API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
