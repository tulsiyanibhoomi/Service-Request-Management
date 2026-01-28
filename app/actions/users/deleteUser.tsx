"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteUser(userid: number) {
    try {
        await prisma.$transaction(async (tx) => {

            await tx.user_role.deleteMany({
                where: { userid },
            });

            await tx.users.delete({
                where: { userid },
            });
        });

        revalidatePath("/users");
        return { success: true };

    } catch (error) {
        console.error("Delete user failed:", error);
        return {
            success: false,
            message: "Unable to delete user. This user may be linked to other records.",
        };
    }
}