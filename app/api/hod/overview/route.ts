import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();

    const HOD_ID = user.userid;

    try {

        const hodDept = await prisma.service_dept_person.findFirst({
            where: {
                userid: HOD_ID,
                is_hod: true,
            },
            select: {
                service_dept_id: true,
            },
        });

        const total = await prisma.service_request.count({
            where: {
                service_request_type: {
                    dept_id: hodDept?.service_dept_id,
                },
            },
        });

        const pending = await prisma.service_request.count({
            where: {
                service_request_type: {
                    dept_id: hodDept?.service_dept_id,
                },
                service_request_status: {
                    service_request_status_name: "Pending",
                },
            },
        });

        const in_progress = await prisma.service_request.count({
            where: {
                service_request_type: {
                    dept_id: hodDept?.service_dept_id,
                },
                service_request_status: {
                    service_request_status_name: "In Progress",
                },
            },
        });

        const completed = await prisma.service_request.count({
            where: {
                service_request_type: {
                    dept_id: hodDept?.service_dept_id,
                },
                service_request_status: {
                    service_request_status_name: "Completed",
                },
            },
        });

        return NextResponse.json({
            total,
            pending,
            in_progress,
            completed,
        });
    } catch (err) {
        console.error("HOD Overview API error:", err);
        return NextResponse.json(
            { message: "Failed to load HOD overview" },
            { status: 500 }
        );
    }
}