import { decodeId } from "@/app/components/utils/url";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const numericId = decodeId(id);
  if (!numericId) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const technicians = await prisma.technician.findMany({
      where: { service_dept_id: Number(numericId), users: { isactive: true } },
      include: {
        users: true,
      },
    });

    const data = technicians.map((t) => ({
      id: t.technician_id,
      name: t.users?.fullname ?? "N/A",
      email: t.users?.email ?? "N/A",
      max_requests_allowed: t.max_requests_allowed,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch technicians:", error);
    return NextResponse.json(
      { message: "Failed to fetch technicians" },
      { status: 500 },
    );
  }
}
