import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const types = await prisma.service_type.findMany({
            select: {
                service_type_id: true,
                service_type_name: true,
            },
        });

        const data = types.map(t => ({
            type_id: t.service_type_id,
            type: t.service_type_name,
        }));

        return NextResponse.json(data);
    } catch (err) {
        console.error("Service Type API error:", err);
        return NextResponse.json([], { status: 500 });
    }
}