"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface ApproveRequestInput {
  requestId: number;
  technicianId: number;
  hodId: number;
  comment?: string;
}

export async function approveServiceRequest({
  requestId,
  technicianId,
  hodId,
  comment,
}: ApproveRequestInput) {
  try {
    if (!technicianId) throw new Error("Technician must be selected");
    if (!requestId) throw new Error("Request ID is required");

    const approvedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Approved" },
    });

    if (!approvedStatus) {
      throw new Error('"Approved" status not found in database');
    }

    const technician = await prisma.technician.findUnique({
      where: { technician_id: technicianId },
    });

    if (!technician) throw new Error("Technician not found");

    const maxAllowed = technician.max_requests_allowed ?? Infinity;

    const activeRequestsCount = await prisma.service_request.count({
      where: {
        assigned_to_technician_id: technicianId,
        service_request_status: {
          service_request_status_name: "In Progress",
        },
      },
    });

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const assignedRequest = await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          assigned_to_technician_id: technicianId,
          assigned_by_user_id: hodId,
          service_request_status_id: approvedStatus.service_request_status_id,
        },
      });

      if (activeRequestsCount + 1 >= maxAllowed) {
        await tx.technician.update({
          where: { technician_id: technicianId },
          data: { availability_status: "busy" },
        });
      }

      await tx.service_request_status_history.create({
        data: {
          request_id: assignedRequest.service_request_id,
          status_id: approvedStatus.service_request_status_id,
          changed_by_user_id: hodId,
          changed_at: now,
          notes: comment ?? null,
        },
      });
    });
    revalidatePath("/hod/requests");
    return { type: "success", message: "Request approved successfully" };
  } catch (error) {
    console.error("Error approving request:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
