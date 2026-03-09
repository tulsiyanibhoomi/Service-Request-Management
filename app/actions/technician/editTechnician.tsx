"use server";

import { Prisma } from "@/app/generated/prisma/client";
import addTechnician from "./addTechnician";

interface EditTechnicianData {
  tx: Prisma.TransactionClient;
  userid: number;
  maxRequestsAllowed: number;
  serviceDeptId: number;
}

export default async function editTechnician({
  tx,
  userid,
  maxRequestsAllowed,
  serviceDeptId,
}: EditTechnicianData) {
  try {
    const existingTech = await tx.technician.findUnique({
      where: { technician_id: userid },
    });

    if (existingTech) {
      await tx.technician.update({
        where: { technician_id: userid },
        data: {
          max_requests_allowed:
            maxRequestsAllowed ?? existingTech.max_requests_allowed,
          service_dept_id: serviceDeptId ?? existingTech.service_dept_id,
        },
      });
    } else {
      await addTechnician({
        userid,
        tx,
        maxRequestsAllowed: maxRequestsAllowed ?? 10,
        serviceDeptId: serviceDeptId ?? 1,
      });
    }
  } catch (err) {
    console.error("Update technician failed:", err);
    throw err;
  }
}
