"use server";

import { Prisma } from "@/app/generated/prisma/client";

interface EditDeptPersonData {
  tx: Prisma.TransactionClient;
  userid: number;
  serviceDeptId: number;
  toDate?: Date;
  isHod: boolean;
}

export default async function editDeptPerson({
  userid,
  tx,
  serviceDeptId,
  toDate,
  isHod,
}: EditDeptPersonData) {
  try {
    const record = await tx.service_dept_person.updateMany({
      where: { userid },
      data: {
        service_dept_id: serviceDeptId,
        to_date: toDate ?? null,
        is_hod: isHod,
      },
    });

    return { success: true, data: record };
  } catch (err: any) {
    console.error("Edit service dept person failed:", err);
    return { success: false, message: err.message || "Failed to edit record" };
  }
}
