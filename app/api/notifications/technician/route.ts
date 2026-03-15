import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { encodeId } from "@/app/components/utils/url";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Technician not logged in" },
        { status: 400 },
      );
    }

    const TECHNICIAN_ID = user.id;

    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);

    const approvedRequests = await prisma.service_request.findMany({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
        service_request_status: { service_request_status_name: "Approved" },
      },
      select: {
        service_request_id: true,
        service_request_title: true,
        service_request_datetime: true,
      },
    });

    const reassignmentRequests = await prisma.service_request.findMany({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
        reassignment_requested: true,
      },
      select: {
        service_request_id: true,
        service_request_title: true,
        service_request_datetime: true,
      },
    });

    const pendingStatuses = ["Pending", "In Progress", "Approved"];
    const deadlineRequests = await prisma.service_request.findMany({
      where: {
        assigned_to_technician_id: TECHNICIAN_ID,
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

    const approvedNotifications = approvedRequests.map((req) => {
      let message = `Request: ${req.service_request_title} is assigned to you.`;
      if (req.service_request_datetime) {
        const formattedDate = new Date(
          req.service_request_datetime,
        ).toLocaleString();
        message += ` Must be completed by ${formattedDate}.`;
      }
      return {
        id: req.service_request_id,
        message,
        link: `/technician/requests/${encodeId(req.service_request_id)}`,
      };
    });

    const reassignmentNotifications = reassignmentRequests.map((req) => {
      let message = `You have requested reassignment for ${req.service_request_title}.`;
      if (req.service_request_datetime) {
        const formattedDate = new Date(
          req.service_request_datetime,
        ).toLocaleString();
        message +=
          req.service_request_datetime > now
            ? ` Must be completed by ${formattedDate}.`
            : ` Deadline missed! Was supposed to be completed by ${formattedDate}.`;
      }
      return {
        id: req.service_request_id,
        message,
        link: `/technician/requests/${encodeId(req.service_request_id)}`,
      };
    });

    const existingIds = new Set([
      ...approvedNotifications.map((n) => n.id),
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
          link: `/technician/requests/${encodeId(req.service_request_id)}`,
        };
      });

    const notifications = [
      ...approvedNotifications,
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
      { error: "Failed to fetch technician notifications" },
      { status: 500 },
    );
  }
}
