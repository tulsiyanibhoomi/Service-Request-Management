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
    return { type: "success", message: "New department added successfully" };
  } catch (error) {
    console.error("Add service dept failed:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
