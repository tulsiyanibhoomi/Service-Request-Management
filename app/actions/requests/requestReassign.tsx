"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();

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
    cookieStore.set({
      name: "flashMessage",
      value: "Request sent for reassignment successfully!",
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
    console.error("Error request reassignment:", error);
    cookieStore.set({
      name: "flashMessage",
      value: "Something went wrong while requesting reassignment",
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
