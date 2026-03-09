"use server";

import { Prisma } from "@/app/generated/prisma/client";

interface AddTechnicianData {
  tx: Prisma.TransactionClient;
  userid: number;
  maxRequestsAllowed: number;
  serviceDeptId: number;
}

export default async function addTechnician({
  tx,
  userid,
  maxRequestsAllowed,
  serviceDeptId,
}: AddTechnicianData) {
  try {
    await tx.technician.create({
      data: {
        technician_id: userid,
        max_requests_allowed: maxRequestsAllowed,
        availability_status: "available",
        service_dept_id: serviceDeptId,
      },
    });
  } catch (err) {
    console.error("Add technician failed:", err);
    throw err;
  }
}
