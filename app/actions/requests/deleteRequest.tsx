"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteRequest(service_request_id: number) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.service_request_reply.deleteMany({
        where: { service_request_id },
      });
      await tx.service_request.delete({
        where: { service_request_id },
      });
    });
    revalidatePath("/requests");
    return { type: "success", message: "Request deleted successfully" };
  } catch (error) {
    console.error("Delete request failed:", error);
    return { type: "error", message: "Something went wrong" };
  }
}
