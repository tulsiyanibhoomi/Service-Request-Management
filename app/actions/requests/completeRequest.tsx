"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface CompleteRequestInput {
  requestId: number;
  technicianId: number;
  comment?: string;
}

export async function completeServiceRequest({
  requestId,
  technicianId,
  comment,
}: CompleteRequestInput) {
  try {
    if (!technicianId)
      return { type: "error", message: "Technician must be selected" };

    if (!requestId) return { type: "error", message: "Request not found" };

    const completedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Completed" },
    });

    if (!completedStatus) {
      return { type: "error", message: "Something went wrong" };
    }

    const technician = await prisma.technician.findUnique({
      where: { technician_id: technicianId },
    });

    if (!technician) return { type: "error", message: "Something went wrong" };

    await prisma.$transaction(async (tx) => {
      await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          service_request_status_id: completedStatus.service_request_status_id,
        },
      });

      await tx.service_request_status_history.create({
        data: {
          request_id: requestId,
          status_id: completedStatus.service_request_status_id,
          changed_at: new Date(),
          changed_by_user_id: technicianId,
          notes: comment,
        },
      });
    });
    revalidatePath("/technician/requests");
    return { type: "success", message: "Request completed successfully" };
  } catch (error) {
    console.error("Error approving request:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
