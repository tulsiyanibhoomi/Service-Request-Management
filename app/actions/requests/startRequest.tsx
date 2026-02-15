"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface StartRequestInput {
  requestId: number;
  technicianId: number;
  comment?: string;
}

export async function startServiceRequest({
  requestId,
  technicianId,
  comment,
}: StartRequestInput) {
  try {
    if (!technicianId) throw new Error("Technician must be selected");
    if (!requestId) throw new Error("Request ID is required");

    const startedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "In Progress" },
    });

    if (!startedStatus) {
      throw new Error('"In Progress" status not found in database');
    }

    const technician = await prisma.technician.findUnique({
      where: { technician_id: technicianId },
    });

    if (!technician) throw new Error("Technician not found");

    await prisma.service_request.update({
      where: { service_request_id: requestId },
      data: {
        service_request_status_id: startedStatus.service_request_status_id,
        service_request_status_datetime: new Date(),
        service_request_status_by_user_id: technicianId,
        service_request_status_description: comment,
        modified: new Date(),
      },
    });

    revalidatePath("/technician/requests");
  } catch (error) {
    console.error("Error approving request:", error);
  }
  redirect("/technician/requests");
}
