"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface WithdrawRequestReassignmentInput {
  requestId: number;
  technicianId: number;
}

export async function withdrawRequestReassign({
  requestId,
  technicianId,
}: WithdrawRequestReassignmentInput) {
  try {
    if (!technicianId) throw new Error("Technician ID not provided");
    if (!requestId) throw new Error("Request ID is required");

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
  } catch (error) {
    console.error("Error withdrawing request:", error);
  }
  redirect("/technician/requests");
}
