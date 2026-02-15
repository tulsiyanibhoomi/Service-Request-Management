import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: "Request ID is required" },
        { status: 400 },
      );
    }

    const req = await prisma.service_request.findUnique({
      where: { service_request_id: Number(id) },
      include: {
        users: {
          select: {
            username: true,
            fullname: true,
          },
        },
        service_request_status: {
          select: {
            service_request_status_name: true,
          },
        },
        users_service_request_service_request_status_by_user_idTousers: {
          select: {
            username: true,
            fullname: true,
          },
        },
        technician: {
          select: {
            technician_id: true,
            users: {
              select: {
                userid: true,
                username: true,
                fullname: true,
              },
            },
          },
        },
        users_service_request_assigned_by_user_idTousers: {
          select: {
            username: true,
            fullname: true,
          },
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
      },
    });

    if (!req) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 },
      );
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
      type: req.service_request_type?.service_type_name ?? "N/A",
      department:
        req.service_request_type?.service_dept.service_dept_name ?? "N/A",
      priority: req.priority_level,
      status: req.service_request_status?.service_request_status_name ?? "N/A",
      status_update_by_user:
        req.users_service_request_service_request_status_by_user_idTousers
          ?.fullname ?? "N/A",
      status_update_datetime: req.service_request_status_datetime,
      datetime: req.service_request_datetime,
      attachments,
      username: req.users.username,
      userfullname: req.users.fullname,
      assigned_to_userid: req.technician?.technician_id ?? 0,
      assigned_to: req.technician?.users.username ?? "N/A",
      assigned_to_fullname: req.technician?.users.fullname ?? "N/A",
      assigned_by:
        req.users_service_request_assigned_by_user_idTousers?.fullname ?? "N/A",
      assigned_datetime: req.assigned_datetime,
      assigned_description: req.assigned_description,
      submitted_at: req.submitted_at,
      approved_at: req.approved_at,
      in_progress_at: req.in_progress_at,
      declined_at: req.declined_at,
      completed_at: req.completed_at,
      closed_at: req.closed_at,
      cancelled_at: req.cancelled_at,
      modified_at: req.modified_at,
    };

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("HOD Requests API error:", err);
    return NextResponse.json(
      { message: "Failed to load employee requests" },
      { status: 500 },
    );
  }
}
