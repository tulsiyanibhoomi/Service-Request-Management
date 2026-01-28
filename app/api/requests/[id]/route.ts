import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        if (!id) {
            return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
        }

        const req = await prisma.service_request.findUnique({
            where: { service_request_id: Number(id) },
            select: {
                service_request_id: true,
                service_request_no: true,
                service_request_title: true,
                priority_level: true,
                service_request_description: true,
                service_request_status: { select: { service_request_status_name: true } },
                service_request_type: { select: { service_request_type_name: true } },
                users_service_request_assigned_to_user_idTousers: { select: { username: true } },
                users_service_request_assigned_by_user_idTousers: { select: { username: true } },
                service_request_datetime: true,
                attachment_path: true,
                attachment_path2: true,
                attachment_path3: true,
                attachment_path4: true,
                attachment_path5: true,
            },
        });

        if (!req) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        const attachments = [
            req.attachment_path,
            req.attachment_path2,
            req.attachment_path3,
            req.attachment_path4,
            req.attachment_path5,
        ].filter((a) => a);

        const formatted = {
            service_request_id: req.service_request_id,
            no: req.service_request_no,
            title: req.service_request_title,
            description: req.service_request_description,
            type: req.service_request_type?.service_request_type_name ?? "N/A",
            priority: req.priority_level,
            status: req.service_request_status?.service_request_status_name ?? "N/A",
            datetime: req.service_request_datetime,
            attachments,
            assigned_to: req.users_service_request_assigned_to_user_idTousers,
            assigned_by: req.users_service_request_assigned_by_user_idTousers
        };

        return NextResponse.json(formatted);
    } catch (err) {
        console.error("Employee Requests API error:", err);
        return NextResponse.json(
            { message: "Failed to load employee requests" },
            { status: 500 }
        );
    }
}
