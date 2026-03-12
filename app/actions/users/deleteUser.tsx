"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteUser(userid: number) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user_role.deleteMany({ where: { userid } });
      const hasDeptPerson = await tx.service_dept_person.findFirst({
        where: { userid },
      });
      const hasRequestHistory =
        await tx.service_request_status_history.findFirst({
          where: { changed_by_user_id: userid },
        });

      const hasTechnician = await tx.technician.findFirst({
        where: { technician_id: userid },
      });

      const hasOtherReferences =
        hasDeptPerson || hasRequestHistory || hasTechnician;

      if (hasOtherReferences) {
        await tx.users.update({
          where: { userid },
          data: { isactive: false },
        });
        if (hasDeptPerson) {
          await tx.service_dept_person.update({
            where: {
              service_dept_person_id: hasDeptPerson.service_dept_person_id,
            },
            data: { to_date: new Date() },
          });
        }
      } else {
        await tx.users.delete({ where: { userid } });
        await tx.service_dept_person.deleteMany({ where: { userid } });
      }
    });
    revalidatePath("/admin/users");
    return { type: "success", message: "User deleted successfully" };
  } catch (error) {
    console.error("Delete user failed:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
