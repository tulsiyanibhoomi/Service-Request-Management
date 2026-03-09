"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function deleteRequest(service_request_id: number) {
  const cookieStore = await cookies();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.service_request_reply.deleteMany({
        where: { service_request_id },
      });
      await tx.service_request.delete({
        where: { service_request_id },
      });
    });

    cookieStore.set({
      name: "flashMessage",
      value: "Request deleted successfully!",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "info",
      path: "/",
      maxAge: 5,
    });

    revalidatePath("/requests");
  } catch (error) {
    console.error("Delete request failed:", error);
    cookieStore.set({
      name: "flashMessage",
      value: "Something went wrong while deleting request",
      path: "/",
      maxAge: 5,
    });

    cookieStore.set({
      name: "flashType",
      value: "error",
      path: "/",
      maxAge: 5,
    });
  }
}
