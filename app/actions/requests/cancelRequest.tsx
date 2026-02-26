"use server";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface CancelRequestInput {
  requestId: number;
  reason: string;
}

export async function cancelServiceRequest({
  requestId,
  reason,
}: CancelRequestInput) {
  const cookieStore = await cookies();

  try {
    if (!requestId) throw new Error("Request ID is required");
    if (!reason || reason.trim() === "") {
      throw new Error("Reason is required to close the request");
    }

    const request = await prisma.service_request.findUnique({
      where: { service_request_id: requestId },
    });

    if (!request) throw new Error("Service request not found");

    const cancelledStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Cancelled" },
    });

    if (!cancelledStatus) {
      throw new Error('"Cancelled" status not found in database');
    }

    const user = await getCurrentUser();

    if (!user) throw new Error("User not logged in");

    const employee_id = user.userid;

    await prisma.$transaction(async (tx) => {
      await tx.service_request.update({
        where: { service_request_id: requestId },
        data: {
          service_request_status_id: cancelledStatus.service_request_status_id,
        },
      });

      await tx.service_request_status_history.create({
        data: {
          request_id: requestId,
          status_id: cancelledStatus.service_request_status_id,
          changed_at: new Date(),
          changed_by_user_id: employee_id,
          notes: reason,
        },
      });
    });

    cookieStore.set({
      name: "flashMessage",
      value: "Request cancelled successfully!",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "info",
      path: "/",
      maxAge: 5,
    });
  } catch (error) {
    console.error("Error cancelling request:", error);
    cookieStore.set({
      name: "flashMessage",
      value: "Something went wrong while cancelling request",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "error",
      path: "/",
      maxAge: 5,
    });
    throw error;
  }
  revalidatePath("/employee/requests");
  redirect("/employee/requests");
}
