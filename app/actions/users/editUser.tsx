"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface EditUserData {
  userid: number;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
}

export default async function editUser({
  userid,
  username,
  fullName,
  email,
  password,
  role,
}: EditUserData) {
  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }],
        NOT: { userid },
      },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const dataToUpdate: any = {
      username,
      fullname: fullName,
      email,
      isactive: true,
    };

    if (password?.trim()) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await prisma.users.update({
      where: { userid },
      data: dataToUpdate,
    });

    await prisma.user_role.deleteMany({
      where: { userid },
    });

    const roleRecord = await prisma.role.findUnique({
      where: { rolename: role },
    });

    if (!roleRecord) {
      throw new Error("Role not found");
    }

    await prisma.user_role.create({
      data: {
        userid,
        roleid: roleRecord.roleid,
      },
    });
  } catch (err) {
    console.error("Edit user failed:", err);
    throw err;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
