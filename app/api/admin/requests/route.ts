import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const requests = await prisma.service_request.findMany({
            orderBy: { created: 'desc' },
            select: {
                service_request_id: true,
                service_request_no: true,
                service_request_title: true,
                priority_level: true,
                service_request_status: {
                    select: { service_request_status_name: true },
                },
                service_request_type: {
                    select: {
                        service_type_name: true,
                        dept_id: true,
                        service_dept: {
                            select: {
                                service_dept_name: true,
                            },
                        },
                    },
                },
                created: true,
            },
        });

        const formatted = requests.map((req) => ({
            service_request_id: req.service_request_id,
            no: req.service_request_no,
            title: req.service_request_title,
            type: req.service_request_type.service_type_name,
            department: req.service_request_type.service_dept.service_dept_name,
            priority: req.priority_level,
            status: req.service_request_status.service_request_status_name,
            created_at: req.created,
        }));

        return NextResponse.json(formatted);
    } catch (err) {
        console.error("Employee Requests API error:", err);
        return NextResponse.json(
            { message: "Failed to load employee requests" },
            { status: 500 }
        );
    }
}