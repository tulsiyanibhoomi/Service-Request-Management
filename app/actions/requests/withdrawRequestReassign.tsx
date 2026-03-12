"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface WithdrawRequestReassignmentInput {
  requestId: number;
  technicianId: number;
}

export async function withdrawRequestReassign({
  requestId,
  technicianId,
}: WithdrawRequestReassignmentInput) {
  try {
    if (!technicianId)
      return { type: "error", message: "Technician not selected" };
    if (!requestId) return { type: "error", message: "Request not found" };

    await prisma.$transaction(async (tx) => {
      await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          reassignment_requested: false,
          reassignment_requested_reason: null,
        },
      });
    });
    revalidatePath("/technician/requests");
    return { type: "success", message: "Request for reassignment withdrawn" };
  } catch (error) {
    console.error("Error withdrawing request:", error);
    return { type: "error", message: "something went wrong" };
  }
}
