"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function editServiceDepartment(
  dept_id: number,
  dept_name: string,
  description: string | null = null,
  cc_email: string | null = null,
) {
  try {
    await prisma.service_dept.update({
      where: {
        service_dept_id: dept_id,
      },
      data: {
        service_dept_name: dept_name,
        description,
        cc_email_to_csv: cc_email,
        modified: new Date(),
      },
    });

    revalidatePath(`/admin/departments`);
    return { type: "success", message: "Department updated successfully" };
  } catch (error) {
    console.error("Edit service dept failed:", error);
    return { type: "error", message: "Department updated successfully" };
  }
}
