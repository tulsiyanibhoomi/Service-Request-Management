"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import TextInput from "./textinput";
import SelectInput from "./selectinput";
import HodDeptSelect from "../../utils/hoddeptselect";
import addUser from "@/app/actions/users/addUser";
import editUser from "@/app/actions/users/editUser";
import RoleFields from "./rolefields";

export type Role = { id: number; rolename: string };
export type Department = { id: number; name: string };
export type UserData = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  maxRequestsAllowed?: number;
  serviceDeptId?: number;
};
export type UserErrors = Partial<Record<keyof UserData, string>>;

interface UserFormProps {
  id?: string | null;
  roles: Role[];
  departments: Department[];
  initialUser?: UserData | null;
  setFlash: (flash: { message: string; type: string }) => void;
  currentUserRole: "admin" | "hod";
  currentUserDeptId?: number;
}

export default function UserForm({
  id,
  roles,
  departments,
  initialUser,
  setFlash,
  currentUserRole,
  currentUserDeptId,
}: UserFormProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserData>(
    initialUser || {
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: currentUserRole === "hod" ? "technician" : "",
    },
  );

  const [errors, setErrors] = useState<UserErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof UserData, value: string) => {
    setUser((prev) => {
      let updated = { ...prev, [field]: value };
      if (field === "fullName" && !id) {
        const names = value.trim().split(" ");
        if (names.length > 0) {
          const first = names[0].toLowerCase();
          const last =
            names.length > 1 ? names[names.length - 1].toLowerCase() : "";
          updated.username = last ? `${first}.${last}` : first;
          updated.password = `${first}@123`;
        }
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const newErrors: UserErrors = {};
    if (!user.fullName?.trim()) newErrors.fullName = "Full Name is required";
    if (!user.username?.trim()) newErrors.username = "Username is required";
    if (!user.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email))
      newErrors.email = "Email is invalid";
    if (currentUserRole === "hod") {
      user.role = "Technician";
      user.serviceDeptId = currentUserDeptId ?? undefined;
    }
    if (!user.role?.trim()) newErrors.role = "Role is required";

    const roleLower = user.role.toLowerCase();
    if (
      (roleLower === "technician" || roleLower === "hod") &&
      !user.serviceDeptId
    )
      newErrors.serviceDeptId = "Department is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);
      let result;
      if (id) {
        result = await editUser({ userid: Number(id), ...user });
      } else {
        result = await addUser(user);
      }
      if (currentUserRole === "admin") {
        if (result.type === "success") router.push("/admin/users");
      } else {
        if (result.type === "success") router.push("/hod/technicians");
      }
    } catch (err: any) {
      setFlash({ message: err.message, type: "error" });
      console.error("Failed to save user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const heading = id
    ? "Edit User"
    : currentUserRole === "hod"
      ? "Add Technician"
      : "Add User";

  const buttonText = id
    ? "Save Changes"
    : currentUserRole === "hod"
      ? "Add Technician"
      : "Add User";

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{heading}</h1>

        <TextInput
          label="Full Name"
          value={user.fullName}
          onChange={(v: any) => handleChange("fullName", v)}
          error={errors.fullName}
        />
        <TextInput
          label="Username"
          value={user.username}
          onChange={(v: any) => handleChange("username", v)}
          error={errors.username}
        />
        <TextInput
          label="Email"
          value={user.email}
          onChange={(v: any) => handleChange("email", v)}
          error={errors.email}
          type="email"
        />

        {currentUserRole === "admin" && (
          <SelectInput
            label="Role"
            value={user.role}
            options={roles.map((r) => ({
              value: r.rolename,
              label: r.rolename,
            }))}
            onChange={(v: string) => handleChange("role", v)}
            error={errors.role}
          />
        )}

        <RoleFields
          user={{
            ...user,
            role: currentUserRole === "hod" ? "technician" : user.role,
          }}
          setUser={setUser}
          errors={errors}
          setErrors={setErrors}
          departments={departments}
          currentUserRole={currentUserRole}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-lg text-white ${submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={submitting}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
