"use server";

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

    const request = await prisma.service_request.findUnique({
      where: { service_request_id: Number(id) },
      include: {
        users: { select: { userid: true, username: true, fullname: true } },
        service_request_status: {
          select: { service_request_status_name: true },
        },
        technician: {
          select: {
            technician_id: true,
            users: { select: { userid: true, username: true, fullname: true } },
          },
        },
        service_request_type: {
          select: {
            service_type_name: true,
            dept_id: true,
            service_dept: { select: { service_dept_name: true } },
          },
        },
      },
    });

    const statusHistory = await prisma.service_request_status_history.findMany({
      where: { request_id: Number(id) },
      orderBy: { changed_at: "asc" },
      include: {
        service_request_status: {
          select: { service_request_status_name: true },
        },
        users: {
          select: { userid: true, username: true, fullname: true },
        },
      },
    });

    if (!request) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 },
      );
    }

    const attachments = [
      request.attachment_path,
      request.attachment_path2,
      request.attachment_path3,
      request.attachment_path4,
      request.attachment_path5,
    ].filter(Boolean);

    const formattedHistory = statusHistory.map((h) => ({
      id: h.id.toString(),
      status_id: h.status_id,
      status: h.service_request_status?.service_request_status_name ?? "N/A",
      changed_by_user_id: h.changed_by_user_id,
      changed_by: h.users?.username ?? "N/A",
      changed_by_fullname: h.users?.fullname ?? "N/A",
      changed_at: h.changed_at,
      notes: h.notes ?? null,
    }));

    const formatted = {
      service_request_id: request.service_request_id,
      no: request.service_request_no,
      title: request.service_request_title,
      description: request.service_request_description,
      type_id: request.service_request_type_id,
      type: request.service_request_type?.service_type_name ?? "N/A",
      department:
        request.service_request_type?.service_dept?.service_dept_name ?? "N/A",
      priority: request.priority_level,
      status:
        request.service_request_status?.service_request_status_name ?? "N/A",
      datetime: request.service_request_datetime,
      attachments,
      submitted_at: request.submitted_at,
      username: request.users.username,
      userfullname: request.users.fullname,
      assigned_to_userid: request.technician?.technician_id ?? 0,
      assigned_to: request.technician?.users.username ?? "N/A",
      assigned_to_fullname: request.technician?.users.fullname ?? "N/A",
      reassignment_requested: request.reassignment_requested,
      reassignment_requested_reason: request.reassignment_requested_reason,
      status_history: formattedHistory,
    };

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Service Request API error:", err);
    return NextResponse.json(
      { message: "Failed to load service request" },
      { status: 500 },
    );
  }
}
