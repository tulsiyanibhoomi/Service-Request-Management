import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const HOD_ID = user.userid;

    const hodDept = await prisma.service_dept_person.findFirst({
      where: {
        userid: HOD_ID,
        is_hod: true,
      },
      select: {
        service_dept_id: true,
      },
    });

    const requests = await prisma.service_request.findMany({
      where: {
        service_request_type: {
          dept_id: hodDept?.service_dept_id,
        },
        service_request_status: {
          service_request_status_name: "Pending",
        },
      },
      orderBy: {
        submitted_at: "desc",
      },
      select: {
        service_request_id: true,
        service_request_no: true,
        service_request_title: true,
        priority_level: true,
        submitted_at: true,
        service_request_type: {
          select: {
            service_type_name: true,
          },
        },
      },
    });

    const formatted = requests.map((req) => ({
      service_request_id: req.service_request_id,
      no: req.service_request_no,
      title: req.service_request_title,
      type: req.service_request_type.service_type_name,
      priority: req.priority_level,
      date: req.submitted_at,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("HOD Requests API error:", err);
    return NextResponse.json(
      { message: "Failed to load HOD requests" },
      { status: 500 },
    );
  }
}
