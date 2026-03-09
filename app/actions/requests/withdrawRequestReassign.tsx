"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface WithdrawRequestReassignmentInput {
  requestId: number;
  technicianId: number;
}

export async function withdrawRequestReassign({
  requestId,
  technicianId,
}: WithdrawRequestReassignmentInput) {
  const cookieStore = await cookies();
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

    cookieStore.set({
      name: "flashMessage",
      value: "Request for withdrawal of reassignment sent successfully!",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "info",
      path: "/",
      maxAge: 5,
    });

    revalidatePath("/technician/requests");
  } catch (error) {
    console.error("Error withdrawing request:", error);
    cookieStore.set({
      name: "flashMessage",
      value: "Something went wrong while sending request for withdrawal",
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
  redirect("/technician/requests");
}
