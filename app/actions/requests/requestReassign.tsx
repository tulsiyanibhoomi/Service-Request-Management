"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface RequestReassignmentInput {
  requestId: number;
  technicianId: number;
  reason: string;
}

export async function requestReassignment({
  requestId,
  technicianId,
  reason,
}: RequestReassignmentInput) {
  try {
    if (!technicianId)
      return { type: "error", message: "Technician not found" };
    if (!requestId) return { type: "error", message: "Request not found" };

    await prisma.$transaction(async (tx) => {
      await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          reassignment_requested: true,
          reassignment_requested_reason: reason,
        },
      });
    });
    revalidatePath("/technician/requests");
    return { type: "success", message: "Request for reassignment sent" };
  } catch (error) {
    console.error("Error request reassignment:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
