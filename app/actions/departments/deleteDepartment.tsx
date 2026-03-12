"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteDepartment(service_dept_id: number) {
  try {
    await prisma.$transaction(async (tx) => {
      const linked_dept_person = await tx.service_dept_person.count({
        where: { service_dept_id },
      });

      const serviceTypes = await tx.service_type.findMany({
        where: { dept_id: service_dept_id },
        select: { service_type_id: true },
      });

      const serviceTypeIds = serviceTypes.map((st) => st.service_type_id);

      const linked_requests = serviceTypeIds.length
        ? await tx.service_request.count({
            where: { service_request_type_id: { in: serviceTypeIds } },
          })
        : 0;

      if (linked_dept_person > 0 || linked_requests > 0) {
        await tx.service_dept.update({
          where: { service_dept_id },
          data: { isactive: false },
        });
      } else {
        await tx.service_type.deleteMany({
          where: { dept_id: service_dept_id },
        });

        await tx.service_dept.delete({
          where: { service_dept_id },
        });
      }
    });
    revalidatePath("/admin/departments");
    return { type: "success", message: "Department deleted successfully" };
  } catch (error) {
    console.error("Delete department failed:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
