"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CloseRequestInput {
    requestId: number;
    hodId: number;
    comment?: string;
}

export async function closeServiceRequest({
    requestId,
    hodId,
    comment,
}: CloseRequestInput) {
    try {
        if (!requestId) throw new Error("Request ID is required");
        if (!comment || comment.trim() === "") {
            throw new Error("Comment is required to close the request");
        }

        const closedStatus = await prisma.service_request_status.findFirst({
            where: { service_request_status_name: "Closed" },
        });

        if (!closedStatus) {
            throw new Error('"Closed" status not found in database');
        }

        await prisma.service_request.update({
            where: { service_request_id: requestId },
            data: {
                service_request_status_id: closedStatus.service_request_status_id,
                service_request_status_datetime: new Date(),
                service_request_status_by_user_id: hodId,
                modified: new Date(),
                last_comment: comment,
            },
        });

        revalidatePath("/hod/requests");
    } catch (error) {
        console.error("Error closing request:", error);
    }
    redirect("/hod/requests");
}