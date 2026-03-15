import { decodeId } from "@/app/components/utils/url";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deptId = searchParams.get("deptId");
    const decodedId = decodeId(deptId!);

    const hodDept = await prisma.service_dept_person.findFirst({
      where: {
        service_dept_id: Number(decodedId),
        is_hod: true,
      },
      select: {
        service_dept_id: true,
      },
    });

    const technicians = await prisma.technician.findMany({
      where: {
        service_dept_id: hodDept?.service_dept_id,
        users: {
          is: {
            isactive: true,
          },
        },
      },
      select: {
        technician_id: true,
        users: {
          select: {
            fullname: true,
          },
        },
        availability_status: true,
      },
    });

    const statusOrder: Record<string, number> = {
      available: 1,
      busy: 2,
      on_leave: 3,
    };

    const data = technicians
      .sort(
        (a, b) =>
          statusOrder[a.availability_status] -
          statusOrder[b.availability_status],
      )
      .map((t) => ({
        id: t.technician_id,
        name: t.users.fullname,
        status: t.availability_status,
        selectable: t.availability_status === "available",
      }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Technicians List API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
