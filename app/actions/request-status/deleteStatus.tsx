"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
export default async function deleteRequestStatus(
  service_request_status_id: number,
) {
  try {
    const fallbackStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "In Progress" },
    });
    if (!fallbackStatus)
      return { type: "error", message: "No fallback status available" };
    if (fallbackStatus.service_request_status_id === service_request_status_id)
      return { type: "error", message: "Fallback Status cannot be deleted" };
    await prisma.$transaction(async (tx) => {
      await tx.service_request.updateMany({
        where: { service_request_status_id },
        data: {
          service_request_status_id: fallbackStatus.service_request_status_id,
        },
      });

      await tx.service_request_status.delete({
        where: { service_request_status_id },
      });
    });
    revalidatePath("/admin/request-status");
    return { type: "success", message: "Request Status deleted successfully" };
  } catch (error) {
    console.error("Delete status failed:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
