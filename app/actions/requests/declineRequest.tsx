"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface DeclineRequestInput {
  requestId: number;
  hodId: number;
  comment: string;
}

export async function declineServiceRequest({
  requestId,
  hodId,
  comment,
}: DeclineRequestInput) {
  try {
    if (!requestId) throw new Error("Request ID is required");
    if (!comment || comment.trim() === "") {
      throw new Error("Comment is required to decline the request");
    }

    const declinedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Declined" },
    });

    if (!declinedStatus) {
      throw new Error('"Declined" status not found in database');
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await prisma.service_request.update({
        where: { service_request_id: requestId },
        data: {
          service_request_status_id: declinedStatus.service_request_status_id,
        },
      });

      await tx.service_request_status_history.create({
        data: {
          request_id: requestId,
          status_id: declinedStatus.service_request_status_id,
          changed_by_user_id: hodId,
          changed_at: now,
          notes: comment,
        },
      });
    });
    revalidatePath("/hod/requests");
    return { type: "success", message: "Request declined successfully" };
  } catch (error) {
    console.error("Error declining request:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
