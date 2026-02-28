"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
      } else {
        await tx.users.delete({ where: { userid } });
      }
    });
  } catch (error) {
    console.error("Delete user failed:", error);
    return {
      success: false,
      message:
        "Unable to delete user. This user may be linked to other records.",
    };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
