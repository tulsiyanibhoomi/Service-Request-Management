"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface DeclineReassignmentInput {
  requestId: number;
  hodId: number;
  comment?: string;
}

export async function declineReassignment({
  requestId,
  hodId,
  comment,
}: DeclineReassignmentInput) {
  try {
    if (!hodId) return { type: "error", message: "Technician not selected" };
    if (!requestId) return { type: "error", message: "Request not found" };

    const request = await prisma.service_request.findUnique({
      where: { service_request_id: requestId },
    });

    if (!request) return { type: "error", message: "Request not found" };

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          reassignment_requested: false,
          reassignment_requested_reason: null,
        },
      });

      await tx.service_request_status_history.create({
        data: {
          request_id: requestId,
          status_id: request.service_request_status_id,
          changed_by_user_id: hodId,
          changed_at: now,
          notes: comment?.trim() || "Reassignment request declined",
        },
      });
    });
    revalidatePath("/hod/requests");
    return { type: "success", message: "Reruest for reassignment declined" };
  } catch (error) {
    console.error("Error declining reassignment:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
