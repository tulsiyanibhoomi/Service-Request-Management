import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const EMPLOYEE_ID = 2;

    try {
        const requests = await prisma.service_request.findMany({
            where: { userid: EMPLOYEE_ID },
            orderBy: { service_request_datetime: "desc" },
            select: {
                service_request_id: true,
                service_request_no: true,
                service_request_title: true,
                priority_level: true,
                service_request_description: true,
                service_request_status: {
                    select: { service_request_status_name: true },
                },
                service_request_type: {
                    select: { service_request_type_name: true },
                },
                service_request_datetime: true,
            },
            take: 5
        });

        const formatted = requests.map((req) => ({
            service_request_id: req.service_request_id,
            no: req.service_request_no,
            title: req.service_request_title,
            description: req.service_request_description,
            type: req.service_request_type.service_request_type_name,
            priority: req.priority_level,
            status: req.service_request_status.service_request_status_name,
            date: req.service_request_datetime,
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