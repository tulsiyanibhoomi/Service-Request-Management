import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { encodeId } from "@/app/components/utils/url";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.departmentId) {
      return NextResponse.json(
        { error: "HOD is not assigned to any department" },
        { status: 400 },
      );
    }
    const HOD_DEPARTMENT_ID = user.departmentId;

    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);

    const pendingRequests = await prisma.service_request.findMany({
      where: {
        service_request_status: { service_request_status_name: "Pending" },
        service_request_type: { dept_id: HOD_DEPARTMENT_ID },
      },
      select: {
        service_request_id: true,
        service_request_title: true,
        service_request_datetime: true,
      },
    });

    const reassignmentRequests = await prisma.service_request.findMany({
      where: {
        reassignment_requested: true,
        service_request_type: { dept_id: HOD_DEPARTMENT_ID },
      },
      select: {
        service_request_id: true,
        service_request_title: true,
        assigned_to_technician_id: true,
        technician: { select: { users: { select: { fullname: true } } } },
        service_request_datetime: true,
      },
    });

    const pendingStatuses = ["Pending", "In Progress", "Approved"];
    const deadlineRequests = await prisma.service_request.findMany({
      where: {
        service_request_type: { dept_id: HOD_DEPARTMENT_ID },
        service_request_status: {
          service_request_status_name: { in: pendingStatuses },
        },
        service_request_datetime: { not: null, gte: twoDaysAgo },
      },
      select: {
        service_request_id: true,
        service_request_title: true,
        service_request_datetime: true,
      },
    });

    const pendingNotifications = pendingRequests.map((req) => ({
      id: req.service_request_id,
      message: `Request: ${req.service_request_title} is pending to be reviewed.`,
      timestamp: req.service_request_datetime?.toISOString() || undefined,
      link: `/hod/requests/${encodeId(req.service_request_id)}`,
    }));

    const reassignmentNotifications = reassignmentRequests.map((req) => {
      const technicianName = req.technician?.users?.fullname || "A technician";
      let message = `${technicianName} has requested reassignment for ${req.service_request_title} request.`;

      if (req.service_request_datetime) {
        const formattedDate = new Date(
          req.service_request_datetime,
        ).toLocaleString();
        if (req.service_request_datetime > now) {
          message += ` Must be completed by ${formattedDate}.`;
        } else {
          message += ` Deadline missed! Was supposed to be completed by ${formattedDate}.`;
        }
      }

      return {
        id: req.service_request_id,
        message,
        link: `/hod/requests/${encodeId(req.service_request_id)}`,
      };
    });

    const existingIds = new Set([
      ...pendingNotifications.map((n) => n.id),
      ...reassignmentNotifications.map((n) => n.id),
    ]);

    const deadlineNotifications = deadlineRequests
      .filter((req) => !existingIds.has(req.service_request_id))
      .map((req) => {
        const formattedDate = new Date(
          req.service_request_datetime!,
        ).toLocaleString();
        const message =
          req.service_request_datetime! > now
            ? `Request ${req.service_request_title} must be completed by ${formattedDate}.`
            : `Request ${req.service_request_title} missed its deadline (${formattedDate}).`;

        return {
          id: req.service_request_id,
          message,
          link: `/hod/requests/${encodeId(req.service_request_id)}`,
        };
      });

    const notifications = [
      ...pendingNotifications,
      ...reassignmentNotifications,
      ...deadlineNotifications,
    ];

    return NextResponse.json({
      notifications_count: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch HOD notifications" },
      { status: 500 },
    );
  }
}
