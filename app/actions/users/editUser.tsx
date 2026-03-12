"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
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
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.users.findFirst({
        where: {
          OR: [{ username }, { email }],
          NOT: { userid },
        },
      });
      if (existingUser) {
        return { type: "error", message: "Username or Email already exists" };
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
      if (!roleRecord) return { type: "error", message: "Role not found" };

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

      // success from transaction
      return { type: "success", message: "User updated successfully" };
    });

    revalidatePath("/admin/users");
    return result; // ✅ Return transaction result to frontend
  } catch (err: any) {
    console.error("Update user failed:", err);
    return { type: "error", message: err?.message || "Something went wrong" };
  }
}
