"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export default async function addRequest(formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user) throw new Error("User not logged in");

    const employee_id = user.userid;

    const now = new Date();

    const submittedStatus = await prisma.service_request_status.findFirst({
      where: { service_request_status_name: "Pending" },
    });

    if (!submittedStatus) {
      throw new Error('"Submitted" status not found in database');
    }

    const serviceRequestNo = formData.get("serviceRequestNo") as string;
    const serviceRequestDateTime = formData.get(
      "serviceRequestDateTime",
    ) as string;
    const serviceRequestTypeId = formData.get("serviceRequestTypeId") as string;
    const serviceRequestTitle = formData.get("serviceRequestTitle") as string;
    const serviceRequestDescription = formData.get(
      "serviceRequestDescription",
    ) as string;
    const urgency = formData.get("urgency") as string;

    const attachmentPaths = JSON.parse(
      formData.get("existingFiles") as string,
    ) as string[];

    await prisma.$transaction(async (tx) => {
      const newRequest = await tx.service_request.create({
        data: {
          service_request_no: serviceRequestNo,
          service_request_title: serviceRequestTitle,
          service_request_datetime:
            serviceRequestDateTime === ""
              ? null
              : new Date(serviceRequestDateTime),
          service_request_description: serviceRequestDescription,
          service_request_type_id: Number(serviceRequestTypeId),
          service_request_status_id: submittedStatus.service_request_status_id,
          employee_id: employee_id,
          priority_level: urgency,
          submitted_at: now,
          attachment_path: attachmentPaths[0] || null,
          attachment_path2: attachmentPaths[1] || null,
          attachment_path3: attachmentPaths[2] || null,
          attachment_path4: attachmentPaths[3] || null,
          attachment_path5: attachmentPaths[4] || null,
        },
      });

      await tx.service_request_status_history.create({
        data: {
          request_id: newRequest.service_request_id,
          status_id: submittedStatus.service_request_status_id,
          changed_by_user_id: employee_id,
          changed_at: now,
        },
      });
    });
  } catch (error) {
    console.error("Error submitting request:", error);
    throw error;
  }
  revalidatePath("/employee/requests");
  redirect("/employee/requests");
}
