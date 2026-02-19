"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CloseRequestInput {
  requestId: number;
  hodId: number;
  comment?: string;
}

export async function closeServiceRequest({
  requestId,
  hodId,
  comment,
}: CloseRequestInput) {
  try {
    if (!requestId) throw new Error("Request ID is required");
    if (!comment || comment.trim() === "") {
      throw new Error("Comment is required to close the request");
    }

    const request = await prisma.service_request.findUnique({
      where: { service_request_id: requestId },
    });

    if (!request) throw new Error("Service request not found");

    const technicianId = request.assigned_to_technician_id;

    const closedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Closed" },
    });

    if (!closedStatus) {
      throw new Error('"Closed" status not found in database');
    }

    await prisma.$transaction(async (tx) => {
      await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          service_request_status_id: closedStatus.service_request_status_id,
        },
      });

      await tx.service_request_status_history.create({
        data: {
          request_id: requestId,
          status_id: closedStatus.service_request_status_id,
          changed_at: new Date(),
          changed_by_user_id: hodId,
          notes: comment,
        },
      });
    });

    if (technicianId) {
      const technician = await prisma.technician.findUnique({
        where: { technician_id: technicianId },
      });

      if (technician) {
        const activeRequestsCount = await prisma.service_request.count({
          where: {
            assigned_to_technician_id: technicianId,
            service_request_status: {
              service_request_status_name: "In Progress",
            },
          },
        });

        if (activeRequestsCount < technician.max_requests_allowed) {
          await prisma.technician.update({
            where: { technician_id: technicianId },
            data: { availability_status: "available" },
          });
        }
      }
    }

    revalidatePath("/hod/requests");
  } catch (error) {
    console.error("Error closing request:", error);
  }
  redirect("/hod/requests");
}
