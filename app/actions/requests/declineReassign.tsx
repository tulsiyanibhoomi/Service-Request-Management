"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const cookieStore = await cookies();
  try {
    if (!hodId) throw new Error("HOD ID not provided");
    if (!requestId) throw new Error("Request ID is required");

    const request = await prisma.service_request.findUnique({
      where: { service_request_id: requestId },
    });

    if (!request) throw new Error("Service request not found");

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

    cookieStore.set({
      name: "flashMessage",
      value: "Request Reassign declined successfully!",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "info",
      path: "/",
      maxAge: 5,
    });

    revalidatePath("/hod/requests");
  } catch (error) {
    console.error("Error declining reassignment:", error);
    cookieStore.set({
      name: "flashMessage",
      value: "Something went wrong while declining reassigning request",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "error",
      path: "/",
      maxAge: 5,
    });
  }

  redirect("/hod/requests");
}
