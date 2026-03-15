import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { encodeId } from "@/app/components/utils/url";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Employee not logged in" },
        { status: 400 },
      );
    }

    const EMPLOYEE_ID = user.id;

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const employeeRequests = await prisma.service_request.findMany({
      where: {
        employee_id: EMPLOYEE_ID,
        service_request_status_history: {
          some: {
            changed_at: { gte: twoDaysAgo },
          },
        },
      },
      select: {
        service_request_id: true,
        service_request_title: true,
        service_request_status: {
          select: { service_request_status_name: true },
        },
        service_request_datetime: true,
        reassignment_requested: true,
        service_request_status_history: {
          select: {
            changed_at: true,
            service_request_status: {
              select: { service_request_status_name: true },
            },
          },
          orderBy: { changed_at: "desc" },
          take: 1,
        },
      },
    });

    const notifications = employeeRequests
      .map((req) => {
        const latestHistory = req.service_request_status_history[0];
        const statusName = latestHistory
          ? latestHistory.service_request_status.service_request_status_name
          : req.service_request_status.service_request_status_name;
        if (
          statusName.toLowerCase() === "pending" ||
          statusName.toLowerCase() === "cancelled"
        )
          return null;

        const now = new Date();
        const messages: string[] = [];

        messages.push(
          `Your request: ${req.service_request_title} was ${statusName.toLowerCase()}.`,
        );

        if (req.service_request_datetime) {
          const deadline = new Date(req.service_request_datetime);
          messages.push(
            deadline > now
              ? `Must be completed by ${deadline.toLocaleString()}.`
              : `Deadline missed! Was supposed to be completed by ${deadline.toLocaleString()}.`,
          );
        }

        if (req.reassignment_requested) {
          messages.push(`You have requested reassignment for this request.`);
        }

        return {
          id: req.service_request_id,
          message: messages.join(" "),
          link: `/employee/requests/${encodeId(req.service_request_id)}`,
          timestamp:
            latestHistory?.changed_at?.toISOString() ||
            req.service_request_datetime?.toISOString(),
        };
      })
      .filter((n) => n !== null); // remove nulls (pending requests)
    const sortedNotifications = notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return NextResponse.json({
      notifications_count: sortedNotifications.length,
      notifications: sortedNotifications,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch employee notifications" },
      { status: 500 },
    );
  }
}
