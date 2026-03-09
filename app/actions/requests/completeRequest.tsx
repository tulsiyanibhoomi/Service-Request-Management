"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const cookieStore = await cookies();

  try {
    if (!technicianId) throw new Error("Technician must be selected");
    if (!requestId) throw new Error("Request ID is required");

    const completedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Completed" },
    });

    if (!completedStatus) {
      throw new Error('"Completed" status not found in database');
    }

    const technician = await prisma.technician.findUnique({
      where: { technician_id: technicianId },
    });

    if (!technician) throw new Error("Technician not found");

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
    cookieStore.set({
      name: "flashMessage",
      value: "Request completed successfully!",
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
    console.error("Error approving request:", error);
    cookieStore.set({
      name: "flashMessage",
      value: "Something went wrong while completing request",
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
