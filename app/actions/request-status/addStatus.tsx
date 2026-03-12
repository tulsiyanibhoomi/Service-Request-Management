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
    return {
      type: "success",
      message: "New request status added successfully",
    };
  } catch (error) {
    console.error("Add service request status failed:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
