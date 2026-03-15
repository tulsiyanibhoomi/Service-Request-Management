import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const status = await prisma.service_request_status.findMany();

    const data = status.map((r) => ({
      id: r.service_request_status_id,
      name: r.service_request_status_name,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Service Request API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
