"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    if (!technicianId) throw new Error("Technician ID not provided");
    if (!requestId) throw new Error("Request ID is required");

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
  } catch (error) {
    console.error("Error request reassignment:", error);
  }
  redirect("/technician/requests");
}
