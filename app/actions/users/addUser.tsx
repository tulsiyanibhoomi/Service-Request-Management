"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import addTechnician from "../technician/addTechnician";
import addDeptPerson from "../dept-person/addDeptPerson";
import { toast } from "react-toastify";

interface AddUserData {
  username: string;
  fullName: string;
  email: string;
  role: string;
  maxRequestsAllowed?: number;
  serviceDeptId?: number;
}

export default async function addUser({
  username,
  fullName,
  email,
  role,
  maxRequestsAllowed,
  serviceDeptId,
}: AddUserData) {
  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const names = fullName.trim().split(" ");
    let firstName = fullName;
    if (names.length > 0) {
      firstName = names[0].toLowerCase();
    }

    const defaultPassword = `${firstName.toLowerCase()}@123`;

    const hashedPassword = await bcrypt.hash(defaultPassword!, 10);

    await prisma.$transaction(async (tx) => {
      const createdUser = await tx.users.create({
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

      if (role.toLowerCase() === "technician") {
        await addTechnician({
          userid: createdUser.userid,
          tx,
          maxRequestsAllowed: maxRequestsAllowed ?? 10,
          serviceDeptId: serviceDeptId ?? 1,
        });

        await addDeptPerson({
          userid: createdUser.userid,
          tx,
          serviceDeptId: serviceDeptId ?? 1,
          fromDate: new Date(),
          isHod: false,
        });
      }

      if (role.toLowerCase() === "hod") {
        const currentHod = await tx.service_dept_person.findFirst({
          where: {
            service_dept_id: serviceDeptId,
            is_hod: true,
            to_date: null,
          },
        });

        if (currentHod) {
          await tx.service_dept_person.update({
            where: { userid: currentHod.userid },
            data: { is_hod: false },
          });
        }

        await addDeptPerson({
          userid: createdUser.userid,
          tx,
          serviceDeptId: serviceDeptId ?? 1,
          fromDate: new Date(),
          isHod: true,
        });
      }
    });
  } catch (err: any) {
    console.error("Add user failed:", err);
    throw err;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
