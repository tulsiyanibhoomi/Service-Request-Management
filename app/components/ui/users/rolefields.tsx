"use client";

import TextInput from "./textinput";
import HodDeptSelect from "../../utils/hoddeptselect";
import { Department, UserData, UserErrors } from "./userform";

interface RoleFieldsProps {
  user: UserData;
  setUser: (user: UserData) => void;
  errors: UserErrors;
  setErrors: (errors: UserErrors) => void;
  departments: Department[];
  currentUserRole: "admin" | "hod";
}

export default function RoleFields({
  user,
  setUser,
  errors,
  setErrors,
  departments,
  currentUserRole,
}: RoleFieldsProps) {
  const roleLower = user.role.toLowerCase();

  if (roleLower === "technician") {
    return (
      <>
        <TextInput
          label="Max Requests Allowed"
          value={user.maxRequestsAllowed?.toString() || ""}
          onChange={(v) => setUser({ ...user, maxRequestsAllowed: Number(v) })}
          type="number"
        />
        {currentUserRole === "admin" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              value={user.serviceDeptId ?? ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  serviceDeptId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.serviceDeptId
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.serviceDeptId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.serviceDeptId}
              </p>
            )}
          </div>
        )}
      </>
    );
  }

  if (roleLower === "hod") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <HodDeptSelect
          departments={departments}
          selectedDeptId={user.serviceDeptId ?? 0}
          onChange={(deptId) => {
            setUser({ ...user, serviceDeptId: deptId });
            setErrors({ ...errors, serviceDeptId: undefined });
          }}
        />
        {errors.serviceDeptId && (
          <p className="text-red-600 text-sm mt-1">{errors.serviceDeptId}</p>
        )}
      </div>
    );
  }

  return null; // no extra fields for other roles
}
