"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function addServiceDepartment(
  dept_name: string,
  description: string | null = null,
  cc_email: string | null = null,
) {
  try {
    await prisma.service_dept.create({
      data: {
        service_dept_name: dept_name,
        description,
        cc_email_to_csv: cc_email,
        created: new Date(),
        modified: new Date(),
      },
    });

    revalidatePath(`/admin/departments`);
    return { success: true };
  } catch (error) {
    console.error("Add service dept failed:", error);
    return {
      success: false,
      message: "Failed to add service dept. Please try again.",
    };
  }
}
