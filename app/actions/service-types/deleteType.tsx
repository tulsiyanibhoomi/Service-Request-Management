"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteServiceType(
  service_type_id: number,
  dept_id: number,
) {
  try {
    await prisma.$transaction(async (tx) => {
      const linked_requests = await tx.service_request.count({
        where: { service_request_type_id: service_type_id },
      });

      const totalReferences = linked_requests;

      if (totalReferences === 0) {
        await tx.service_type.delete({
          where: { service_type_id },
        });
      } else {
        await tx.service_type.update({
          where: { service_type_id },
          data: { isactive: false },
        });
      }
    });

    revalidatePath(`/admin/departments/${dept_id}`);
    return { success: true };
  } catch (error) {
    console.error("Delete service type failed:", error);
    return {
      success: false,
      message:
        "Unable to delete service type. It may be linked to other records and was deactivated instead.",
    };
  }
}
