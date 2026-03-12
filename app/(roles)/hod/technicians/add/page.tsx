"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";
import { useFlash } from "@/app/context/FlashContext";
import UserForm, {
  Department,
  Role,
  UserData,
} from "@/app/components/ui/users/userform";

export default function AddEditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { setFlash } = useFlash();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [initialUser, setInitialUser] = useState<UserData | null>(null);

  const [currentUserDeptId, setCurrentUserDeptId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserRes = await fetch("/api/auth/current-user", {
          credentials: "include",
        });
        if (!currentUserRes.ok) throw new Error("Failed to get current user");
        const currentUser = await currentUserRes.json();
        if (!currentUser.user.departmentId)
          throw new Error("Department not found");
        setCurrentUserDeptId(currentUser.user.departmentId);

        const rolesRes = await fetch("/api/roles");
        const rolesData: Role[] = await rolesRes.json();
        setRoles(rolesData);

        const deptRes = await fetch("/api/departments");
        const deptDataRaw = await deptRes.json();
        setDepartments(
          deptDataRaw.map((d: any) => ({ id: d.id, name: d.name })),
        );

        if (id) {
          const userRes = await fetch(`/api/users/${id}`);
          if (!userRes.ok) throw new Error("Failed to fetch user");
          const userData = await userRes.json();

          const matchedRole =
            rolesData.find((r) => r.rolename === userData.role)?.rolename || "";

          setInitialUser({
            username: userData.username,
            fullName: userData.fullname,
            email: userData.email,
            password: "",
            role: matchedRole,
            maxRequestsAllowed: userData.maxRequestsAllowed,
            serviceDeptId: userData.serviceDeptId,
          });
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <SkeletonCard />;
  if (errorMsg) return <CustomError message={errorMsg} />;

  return (
    <UserForm
      id={id}
      roles={roles}
      departments={departments}
      initialUser={initialUser}
      setFlash={setFlash}
      currentUserRole="hod"
      currentUserDeptId={currentUserDeptId}
    />
  );
}
