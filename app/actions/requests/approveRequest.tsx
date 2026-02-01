"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ApproveRequestInput {
    requestId: number;
    technicianId: number;
    hodId: number;
    comment?: string;
}

export async function approveServiceRequest({
    requestId,
    technicianId,
    hodId,
    comment,
}: ApproveRequestInput) {
    try {
        if (!technicianId) throw new Error("Technician must be selected");
        if (!requestId) throw new Error("Request ID is required");

        const inProgressStatus = await prisma.service_request_status.findFirst({
            where: { service_request_status_name: "In Progress" },
        });

        if (!inProgressStatus) {
            throw new Error('"In Progress" status not found in database');
        }

        await prisma.service_request.update({
            where: { service_request_id: requestId },
            data: {
                assigned_to_user_id: technicianId,
                assigned_by_user_id: hodId,
                assigned_description: comment ?? null,
                assigned_datetime: new Date(),
                service_request_status_id: inProgressStatus.service_request_status_id,
                service_request_status_datetime: new Date(),
                service_request_status_by_user_id: hodId,
                modified: new Date(),
            },
        });

        revalidatePath("/hod/requests");
    } catch (error) {
        console.error("Error approving request:", error);
    }
    redirect("/hod/requests");
}