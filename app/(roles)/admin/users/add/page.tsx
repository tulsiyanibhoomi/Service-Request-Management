// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import SkeletonCard from "@/app/components/utils/skeletoncard";
// import CustomError from "@/app/components/utils/error";
// import { toast } from "react-toastify";
// import addUser from "@/app/actions/users/addUser";
// import editUser from "@/app/actions/users/editUser";
// import HodDeptSelect from "@/app/components/utils/hoddeptselect";
// import { useFlash } from "@/app/context/FlashContext";

// type Role = { id: number; rolename: string };
// type Department = {
//   id: number;
//   name: string;
//   description?: string;
//   email?: string;
//   hod?: string | null;
// };

// type UserData = {
//   username: string;
//   fullName: string;
//   email: string;
//   password: string;
//   role: string;
//   maxRequestsAllowed?: number;
//   serviceDeptId?: number;
// };

// type UserErrors = {
//   username?: string;
//   fullName?: string;
//   email?: string;
//   password?: string;
//   role?: string;
//   maxRequestsAllowed?: string;
//   serviceDeptId?: string;
// };

// export default function AddEditUserPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const { setFlash } = useFlash();

//   const [loading, setLoading] = useState(true);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [user, setUser] = useState<UserData>({
//     username: "",
//     fullName: "",
//     email: "",
//     password: "",
//     role: "",
//   });
//   const [errors, setErrors] = useState<UserErrors>({});
//   const [errorMsg, setErrorMsg] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const rolesRes = await fetch("/api/roles");
//         const rolesData: Role[] = await rolesRes.json();
//         setRoles(rolesData);

//         const deptRes = await fetch("/api/departments");
//         const deptDataRaw = await deptRes.json();

//         const formattedDepartments: Department[] = deptDataRaw.map(
//           (dept: any) => ({
//             id: dept.id,
//             name: dept.name,
//           }),
//         );

//         setDepartments(formattedDepartments);

//         if (id) {
//           const userRes = await fetch(`/api/users/${id}`);
//           if (!userRes.ok) throw new Error("Failed to fetch user");
//           const userData = await userRes.json();

//           const matchedRole =
//             rolesData.find((r) => r.rolename === userData.role)?.rolename || "";

//           setUser({
//             username: userData.username,
//             fullName: userData.fullname,
//             email: userData.email,
//             password: "",
//             role: matchedRole,
//             maxRequestsAllowed: userData.maxRequestsAllowed,
//             serviceDeptId: userData.serviceDeptId,
//           });
//         }
//       } catch (err: any) {
//         setErrorMsg(err.message || "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleChange = (field: keyof UserData, value: string) => {
//     setUser((prev) => {
//       let updated = { ...prev, [field]: value };

//       if (field === "fullName" && !id) {
//         const names = value.trim().split(" ");
//         if (names.length > 0) {
//           const first = names[0].toLowerCase();
//           const last =
//             names.length > 1 ? names[names.length - 1].toLowerCase() : "";
//           updated.username = last ? `${first}.${last}` : first;
//           updated.password = `${first}@123`;
//         }
//       }

//       return updated;
//     });
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const handleSubmit = async () => {
//     const newErrors: UserErrors = {};
//     if (!user.fullName?.trim()) newErrors.fullName = "Full Name is required";
//     if (!user.username?.trim()) newErrors.username = "Username is required";
//     if (!user.email?.trim()) newErrors.email = "Email is required";
//     else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email))
//       newErrors.email = "Email is invalid";
//     if (!user.role?.trim()) newErrors.role = "Role is required";
//     const roleLower = user.role.toLowerCase();
//     if (
//       (roleLower === "technician" || roleLower === "hod") &&
//       !user.serviceDeptId
//     ) {
//       newErrors.serviceDeptId = "Department is required";
//     }
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     try {
//       setSubmitting(true);
//       if (id) {
//         const result = await editUser({
//           userid: Number(id),
//           username: user.username,
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           maxRequestsAllowed: user.maxRequestsAllowed,
//           serviceDeptId: user.serviceDeptId,
//         });
//         setFlash({ message: result.message, type: result.type });

//         if (result.type === "success") {
//           router.push("/admin/users");
//         }
//       } else {
//         const result = await addUser({
//           username: user.username,
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           maxRequestsAllowed: user.maxRequestsAllowed,
//           serviceDeptId: user.serviceDeptId,
//         });
//         setFlash({ message: result.message, type: result.type });

//         if (result.type === "success") {
//           router.push("/admin/users");
//         }
//       }
//     } catch (err: any) {
//       setFlash({ message: err.message, type: "error" });
//       console.error("Failed to save user:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <SkeletonCard />;
//   if (errorMsg) return <CustomError message={errorMsg} />;

//   return (
//     <div className="flex justify-center mt-10">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">
//           {id ? "Edit User" : "Add User"}
//         </h1>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <input
//             type="text"
//             value={user.fullName}
//             onChange={(e) => handleChange("fullName", e.target.value)}
//             className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//               errors.fullName
//                 ? "border-red-500 focus:ring-red-500"
//                 : "border-gray-300 focus:ring-blue-500"
//             }`}
//           />
//           {errors.fullName && (
//             <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Username
//           </label>
//           <input
//             type="text"
//             value={user.username}
//             onChange={(e) => handleChange("username", e.target.value)}
//             className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//               errors.username
//                 ? "border-red-500 focus:ring-red-500"
//                 : "border-gray-300 focus:ring-blue-500"
//             }`}
//           />
//           {errors.username && (
//             <p className="text-red-600 text-sm mt-1">{errors.username}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             value={user.email}
//             onChange={(e) => handleChange("email", e.target.value)}
//             className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//               errors.email
//                 ? "border-red-500 focus:ring-red-500"
//                 : "border-gray-300 focus:ring-blue-500"
//             }`}
//           />
//           {errors.email && (
//             <p className="text-red-600 text-sm mt-1">{errors.email}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Role
//           </label>
//           <select
//             value={user.role}
//             onChange={(e) => handleChange("role", e.target.value)}
//             className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//               errors.role
//                 ? "border-red-500 focus:ring-red-500"
//                 : "border-gray-300 focus:ring-blue-500"
//             }`}
//           >
//             <option value="">Select role</option>
//             {roles.map((r) => (
//               <option key={`${r.id}-${r.rolename}`} value={r.rolename}>
//                 {r.rolename}
//               </option>
//             ))}
//           </select>
//           {errors.role && (
//             <p className="text-red-600 text-sm mt-1">{errors.role}</p>
//           )}
//         </div>

//         {/* Technician fields */}
//         {user.role.toLowerCase() === "technician" && (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Max Requests Allowed
//               </label>
//               <input
//                 type="number"
//                 value={user.maxRequestsAllowed || ""}
//                 onChange={(e) =>
//                   setUser((prev) => ({
//                     ...prev,
//                     maxRequestsAllowed: Number(e.target.value),
//                   }))
//                 }
//                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Department
//               </label>
//               <select
//                 value={user.serviceDeptId ?? undefined}
//                 onChange={(e) =>
//                   setUser((prev) => ({
//                     ...prev,
//                     serviceDeptId: e.target.value
//                       ? Number(e.target.value)
//                       : undefined,
//                   }))
//                 }
//                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.id}>
//                     {d.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.serviceDeptId && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.serviceDeptId}
//                 </p>
//               )}
//             </div>
//           </>
//         )}

//         {/* HOD fields */}
//         {user.role.toLowerCase() === "hod" && (
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Department
//             </label>
//             <HodDeptSelect
//               departments={departments}
//               selectedDeptId={user.serviceDeptId ?? 0}
//               onChange={(deptId) => {
//                 setUser((prev) => ({ ...prev, serviceDeptId: deptId }));
//                 setErrors((prev) => ({ ...prev, serviceDeptId: undefined }));
//               }}
//             />
//             {errors.serviceDeptId && (
//               <p className="text-red-600 text-sm mt-1">
//                 {errors.serviceDeptId}
//               </p>
//             )}
//           </div>
//         )}

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={() => router.push("/admin/users")}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             disabled={submitting}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className={`px-5 py-2 rounded-lg text-white ${
//               submitting
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={submitting}
//           >
//             {id ? "Save Changes" : "Add User"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/admin/users/[id]/page.tsx
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

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      currentUserRole="admin"
    />
  );
}
