"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { toast } from "react-toastify";
import addUser from "@/app/actions/users/addUser";
import editUser from "@/app/actions/users/editUser";

type Role = { id: number; rolename: string };

type UserData = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
};

export default function AddEditUserPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [user, setUser] = useState<UserData>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch roles first
        const rolesRes = await fetch("/api/roles/list");
        const rolesData: Role[] = await rolesRes.json();
        setRoles(rolesData);

        if (id) {
          const userRes = await fetch(`/api/users/${id}`);
          if (!userRes.ok) throw new Error("Failed to fetch user");
          const userData = await userRes.json();

          const matchedRole =
            rolesData.find((r) => r.rolename === userData.role)?.rolename || "";

          setUser({
            username: userData.username,
            fullName: userData.fullname,
            email: userData.email,
            password: "",
            role: matchedRole,
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

  const handleChange = (field: keyof UserData, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const newErrors: Partial<UserData> = {};

    if (!user.fullName?.trim()) newErrors.fullName = "Full Name is required";
    if (!user.username?.trim()) newErrors.username = "Username is required";
    if (!user.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email))
      newErrors.email = "Email is invalid";

    if (!id && !user.password?.trim())
      newErrors.password = "Password is required";
    if (!user.role?.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (id) {
      await editUser({
        userid: Number(id),
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: user.role,
      });
    } else {
      await addUser({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: user.password!,
        role: user.role,
      });
    }
  };

  if (loading) return <SkeletonCard />;
  if (errorMsg) return <CustomError message={errorMsg} />;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {id ? "Edit User" : "Add User"}
        </h1>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={user.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.fullName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.username
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder={
              id ? "Leave blank to keep current password" : "Enter password"
            }
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={user.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.role
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select role</option>
            {roles.map((r) => (
              <option key={`${r.id}-${r.rolename}`} value={r.rolename}>
                {r.rolename}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-600 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {id ? "Save Changes" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}
