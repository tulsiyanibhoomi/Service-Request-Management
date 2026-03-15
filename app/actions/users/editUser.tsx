"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import addTechnician from "../technician/addTechnician";
import editTechnician from "../technician/editTechnician";
import addDeptPerson from "../dept-person/addDeptPerson";
import editDeptPerson from "../dept-person/editDeptPerson";
import { decodeId } from "@/app/components/utils/url";

interface EditUserData {
  userid: string;
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
    const decodedId = decodeId(userid);
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.users.findFirst({
        where: {
          OR: [{ username }, { email }],
          NOT: { userid: { equals: Number(decodedId) } },
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
        where: { userid: Number(decodedId) },
        data: dataToUpdate,
      });

      await tx.user_role.deleteMany({ where: { userid: Number(decodedId) } });

      const roleRecord = await tx.role.findUnique({
        where: { rolename: role },
      });
      if (!roleRecord) return { type: "error", message: "Role not found" };

      await tx.user_role.create({
        data: {
          userid: Number(decodedId),
          roleid: roleRecord.roleid,
        },
      });

      if (role.toLowerCase() === "technician") {
        const existingTech = await tx.technician.findUnique({
          where: { technician_id: Number(decodedId) },
        });

        if (existingTech) {
          await editTechnician({
            userid: Number(decodedId),
            tx,
            maxRequestsAllowed: maxRequestsAllowed ?? 10,
            serviceDeptId: serviceDeptId ?? 1,
          });
          await editDeptPerson({
            userid: Number(decodedId),
            tx,
            serviceDeptId: serviceDeptId ?? 1,
            isHod: false,
          });
        } else {
          await addTechnician({
            userid: Number(decodedId),
            tx,
            maxRequestsAllowed: maxRequestsAllowed ?? 10,
            serviceDeptId: serviceDeptId ?? 1,
          });
          await addDeptPerson({
            userid: Number(decodedId),
            tx,
            serviceDeptId: serviceDeptId ?? 1,
            fromDate: new Date(),
            isHod: false,
          });
        }
      }
    });

    revalidatePath("/admin/users");
    return { type: "success", message: "User updated successfully" };
  } catch (err: any) {
    console.error("Update user failed:", err);
    return { type: "error", message: err?.message || "Something went wrong" };
  }
}
