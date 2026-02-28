"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function addServiceType(
  dept_id: number,
  service_type_name: string,
  description: string | null = null,
) {
  try {
    await prisma.service_type.create({
      data: {
        dept_id,
        service_type_name,
        description,
        created: new Date(),
        modified: new Date(),
      },
    });

    revalidatePath(`/admin/departments/${dept_id}`);
    return { success: true };
  } catch (error) {
    console.error("Add service type failed:", error);
    return {
      success: false,
      message: "Failed to add service type. Please try again.",
    };
  }
}
