"use server";

import { Prisma } from "@/app/generated/prisma/client";

interface AddDeptPersonData {
  tx: Prisma.TransactionClient;
  userid: number;
  serviceDeptId: number;
  fromDate: Date;
  isHod: boolean;
}

export default async function addDeptPerson({
  userid,
  tx,
  serviceDeptId,
  fromDate,
  isHod,
}: AddDeptPersonData) {
  try {
    const record = await tx.service_dept_person.create({
      data: {
        userid,
        service_dept_id: serviceDeptId,
        from_date: fromDate,
        is_hod: isHod ? true : false,
      },
    });

    return { success: true, data: record };
  } catch (err: any) {
    console.error("Add service dept person failed:", err);
    return { success: false, message: err.message || "Failed to add record" };
  }
}
