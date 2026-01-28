import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const types = await prisma.service_request_type.findMany({
            select: {
                service_request_type_id: true,
                service_request_type_name: true,
            },
        });

        const data = types.map(t => ({
            type_id: t.service_request_type_id,
            type: t.service_request_type_name,
        }));

        return NextResponse.json(data);
    } catch (err) {
        console.error("Service Request Type API error:", err);
        return NextResponse.json([], { status: 500 });
    }
}