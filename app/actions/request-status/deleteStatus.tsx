"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
export default async function deleteRequestStatus(service_request_status_id: number) {
    try {
        const fallbackStatus = await prisma.service_request_status.findFirst({
            where: { system_name: "in_progress" },
        });

        if (!fallbackStatus) {
            return {
                success: false,
                message: "Cannot delete: no other status exists as fallback.",
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.service_request.updateMany({
                where: { service_request_status_id },
                data: { service_request_status_id: fallbackStatus.service_request_status_id },
            });

            await tx.service_request_status.delete({
                where: { service_request_status_id },
            });
        });

        revalidatePath("/request-status");

        return { success: true };
    } catch (error) {
        console.error("Delete status failed:", error);
        return {
            success: false,
            message: "Unable to delete service request status!",
        };
    }
}