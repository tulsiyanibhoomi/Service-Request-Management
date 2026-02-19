"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteDepartment(service_dept_id: number) {
  try {
    await prisma.$transaction(async (tx) => {
      const linked_dept_person = await tx.service_dept_person.count({
        where: { service_dept_id },
      });

      const linked_request_type = await tx.service_type.count({
        where: { dept_id: service_dept_id },
      });

      const totalReferences = linked_dept_person + linked_request_type;

      if (totalReferences === 0) {
        await tx.service_dept.delete({
          where: { service_dept_id },
        });
      } else {
        await tx.service_dept.update({
          where: { service_dept_id },
          data: { isactive: false },
        });
      }
    });

    revalidatePath("/departments");

    return { success: true };
  } catch (error) {
    console.error("Delete department failed:", error);
    return {
      success: false,
      message:
        "Unable to delete department. It may be linked to other records and was deactivated instead.",
    };
  }
}
