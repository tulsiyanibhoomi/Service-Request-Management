import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await prisma.service_request.findMany({
            orderBy: { service_request_datetime: "desc" },
            take: 5,
            select: {
                service_request_id: true,
                service_request_no: true,
                service_request_title: true,
                priority_level: true,
                service_request_datetime: true,
                service_request_type: { select: { service_type_name: true } },
                service_request_status: { select: { service_request_status_name: true } },
            },
        });

        const formatted = data.map(req => ({
            service_request_id: req.service_request_id,
            no: req.service_request_no,
            title: req.service_request_title,
            type: req.service_request_type.service_type_name,
            priority: req.priority_level,
            status: req.service_request_status.service_request_status_name,
        }));

        return NextResponse.json(formatted);
    } catch (err) {
        console.error("Recent Requests API error:", err);
        return NextResponse.json([], { status: 500 });
    }
}