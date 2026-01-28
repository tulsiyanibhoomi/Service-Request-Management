import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const status = await prisma.service_request_status.findMany({
            select: {
                service_request_status_id: true,
                service_request_status_name: true,
                system_name: true,
                description: true,
            },
        });

        const data = status.map(r => ({
            service_request_status_id: r.service_request_status_id,
            status_name: r.service_request_status_name,
            system_name: r.system_name,
            description: r.description,
        }));

        return NextResponse.json(data);
    } catch (err) {
        console.error("Service Request API error:", err);
        return NextResponse.json([], { status: 500 });
    }
}