"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/app/lib/cloudinary";

export default async function addRequest(formData: FormData) {
    try {
        const serviceRequestNo = formData.get("serviceRequestNo") as string;
        const serviceRequestDateTime = formData.get("serviceRequestDateTime") as string;
        const serviceRequestTypeId = formData.get("serviceRequestTypeId") as string;
        const serviceRequestTitle = formData.get("serviceRequestTitle") as string;
        const serviceRequestDescription = formData.get("serviceRequestDescription") as string;
        const urgency = formData.get("urgency") as string;

        const attachments: File[] = [];
        formData.getAll("attachmentPaths").forEach((file) => {
            if (file instanceof File) attachments.push(file);
        });

        const uploadPaths: string[] = [];

        for (const file of attachments) {
            const buffer = Buffer.from(await file.arrayBuffer());

            const uploadResult: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "service-requests" },
                    (error: any, result: any) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            uploadPaths.push(uploadResult.secure_url);
        }

        const now = new Date();

        await prisma.service_request.create({
            data: {
                service_request_no: serviceRequestNo,
                service_request_title: serviceRequestTitle,
                service_request_datetime: serviceRequestDateTime === ""
                    ? null
                    : new Date(serviceRequestDateTime),
                service_request_description: serviceRequestDescription,
                service_request_type_id: Number(serviceRequestTypeId),
                service_request_status_id: 1,
                userid: 2,
                priority_level: urgency,
                created: now,
                modified: now,
                attachment_path: uploadPaths[0] || null,
                attachment_path2: uploadPaths[1] || null,
                attachment_path3: uploadPaths[2] || null,
                attachment_path4: uploadPaths[3] || null,
                attachment_path5: uploadPaths[4] || null,
            },
        });

        revalidatePath("/employee/requests");
        redirect("/employee/requests");
    } catch (error) {
        console.error("Error submitting request:", error);
        throw error;
    }
}
