import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request, context: { params: { id: number } }) {
  const { id } = await context.params;
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const dept = await prisma.service_dept.findUnique({
    where: { service_dept_id: Number(id) },
    select: {
      service_dept_id: true,
      service_dept_name: true,
      description: true,
      cc_email_to_csv: true,
      created: true,
      modified: true,
      service_dept_person: {
        where: { is_hod: true },
        select: { users: { select: { fullname: true } } },
        take: 1,
      },
      service_type: {
        select: {
          service_type_id: true,
          service_type_name: true,
          description: true,
        },
        where: {
          isactive: true,
        },
      },
    },
  });

  if (!dept) {
    return NextResponse.json(
      { error: "Department not found" },
      { status: 404 },
    );
  }

  const formatted = {
    ...dept,
    hodName: dept.service_dept_person[0]?.users.fullname ?? null,
    service_types: dept.service_type.map((st) => ({
      id: st.service_type_id,
      name: st.service_type_name,
      description: st.description,
    })),
  };

  return NextResponse.json(formatted);
}
