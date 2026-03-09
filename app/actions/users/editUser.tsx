"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import addTechnician from "../technician/addTechnician";
import editTechnician from "../technician/editTechnician";
import addDeptPerson from "../dept-person/addDeptPerson";
import editDeptPerson from "../dept-person/editDeptPerson";

interface EditUserData {
  userid: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  maxRequestsAllowed?: number;
  serviceDeptId?: number;
  password?: string;
}

export default async function editUser({
  userid,
  username,
  fullName,
  email,
  role,
  maxRequestsAllowed,
  serviceDeptId,
}: EditUserData) {
  try {
    await prisma.$transaction(async (tx) => {
      const existingUser = await tx.users.findFirst({
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

      await tx.users.update({
        where: { userid },
        data: dataToUpdate,
      });

      await tx.user_role.deleteMany({ where: { userid } });

      const roleRecord = await tx.role.findUnique({
        where: { rolename: role },
      });
      if (!roleRecord) throw new Error("Role not found");

      await tx.user_role.create({
        data: {
          userid,
          roleid: roleRecord.roleid,
        },
      });

      if (role.toLowerCase() === "technician") {
        const existingTech = await tx.technician.findUnique({
          where: { technician_id: userid },
        });

        if (existingTech) {
          await editTechnician({
            userid,
            tx,
            maxRequestsAllowed: maxRequestsAllowed ?? 10,
            serviceDeptId: serviceDeptId ?? 1,
          });
          await editDeptPerson({
            userid,
            tx,
            serviceDeptId: serviceDeptId ?? 1,
            isHod: false,
          });
        } else {
          await addTechnician({
            userid,
            tx,
            maxRequestsAllowed: maxRequestsAllowed ?? 10,
            serviceDeptId: serviceDeptId ?? 1,
          });
          await addDeptPerson({
            userid,
            tx,
            serviceDeptId: serviceDeptId ?? 1,
            fromDate: new Date(),
            isHod: false,
          });
        }
      }
    });
  } catch (err) {
    console.error("Edit user failed:", err);
    throw err;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
