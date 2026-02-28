"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function addServiceRequestStatus(
  status_name: string,
  description: string | null = null,
) {
  try {
    await prisma.service_request_status.create({
      data: {
        service_request_status_name: status_name,
        description,
      },
    });

    revalidatePath(`/admin/request-status`);
    return { success: true };
  } catch (error) {
    console.error("Add service request status failed:", error);
    return {
      success: false,
      message: "Failed to add service request status. Please try again.",
    };
  }
}
