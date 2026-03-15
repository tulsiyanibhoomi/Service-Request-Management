import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const deptId = url.searchParams.get("deptId");

    const whereClause = deptId
      ? { service_dept: { service_dept_id: Number(deptId) } }
      : {};

    const types = await prisma.service_type.findMany({
      where: whereClause,
      select: {
        service_type_id: true,
        service_type_name: true,
      },
    });

    const data = types.map((t) => ({
      id: t.service_type_id,
      name: t.service_type_name,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Service Type API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
