"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface AddUserData {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
}

export default async function addUser({
  username,
  fullName,
  email,
  password,
  role,
}: AddUserData) {
  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return { success: false, message: "Username or email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password!, 10);

    await prisma.users.create({
      data: {
        username,
        fullname: fullName,
        email,
        password: hashedPassword,
        user_role: {
          create: {
            role: {
              connect: { rolename: role },
            },
          },
        },
        isactive: true,
      },
    });
  } catch (err) {
    console.error("Add user failed:", err);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
