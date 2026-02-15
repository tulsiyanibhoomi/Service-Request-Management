"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/app/lib/cloudinary";

export default async function editRequest(
  requestId: number,
  formData: FormData,
) {
  try {
    const existingFiles = JSON.parse(formData.get("existingFiles") as string);

    const uploadPaths: string[] = [];
    const newFiles = formData.getAll("attachmentPaths") as File[];
    for (const file of newFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "service-requests" }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          })
          .end(buffer);
      });
      uploadPaths.push(uploadResult.secure_url);
    }

    const finalAttachments = [...existingFiles, ...uploadPaths];

    await prisma.service_request.update({
      where: { service_request_id: requestId },
      data: {
        service_request_no: formData.get("serviceRequestNo") as string,
        service_request_title: formData.get("serviceRequestTitle") as string,
        service_request_description: formData.get(
          "serviceRequestDescription",
        ) as string,
        service_request_type_id: Number(formData.get("serviceRequestTypeId")),
        priority_level: formData.get("urgency") as string,
        service_request_datetime:
          (formData.get("serviceRequestDateTime") as string) || null,
        attachment_path: finalAttachments[0] || null,
        attachment_path2: finalAttachments[1] || null,
        attachment_path3: finalAttachments[2] || null,
        attachment_path4: finalAttachments[3] || null,
        attachment_path5: finalAttachments[4] || null,
      },
    });
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
  revalidatePath("/employee/requests");
  redirect("/employee/requests");
}
