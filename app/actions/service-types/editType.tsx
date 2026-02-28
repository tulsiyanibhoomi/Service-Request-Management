"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function editServiceType(
  service_type_id: number,
  dept_id: number,
  service_type_name: string,
  description: string | null = null,
) {
  try {
    await prisma.service_type.update({
      where: { service_type_id },
      data: {
        dept_id,
        service_type_name,
        description,
        modified: new Date(),
      },
    });

    revalidatePath(`/admin/departments/${dept_id}`);
    return { success: true };
  } catch (error) {
    console.error("Edit service type failed:", error);
    return {
      success: false,
      message: "Failed to edit service type. Please try again.",
    };
  }
}
