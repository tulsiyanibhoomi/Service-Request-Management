"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function editServiceRequestStatus(
  status_id: number,
  status_name: string,
  description: string | null = null,
) {
  try {
    await prisma.service_request_status.update({
      where: {
        service_request_status_id: status_id,
      },
      data: {
        service_request_status_name: status_name,
        description,
      },
    });

    revalidatePath(`/admin/request-status`);
    return { success: true };
  } catch (error) {
    console.error("Edit service request status failed:", error);
    return {
      success: false,
      message: "Failed to edit service request status. Please try again.",
    };
  }
}
