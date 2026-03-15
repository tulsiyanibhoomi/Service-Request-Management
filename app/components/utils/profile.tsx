"use client";

import { useEffect, useState } from "react";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";
import TechnicianStatistics from "../ui/admin-details/techstat";
import HodStatistics from "../ui/admin-details/hodstat";
import { encodeId } from "./url";
import EmployeeStatistics from "../ui/admin-details/employeestat";

export type User = {
  id?: string;
  fullname: string;
  username: string;
  role: string;
  email?: string;
  phone?: string;
  departmentName?: string;
};

export default function UserProfile({ userId }: { userId?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const userRes = await fetch("/api/auth/current-user");
        if (!userRes.ok) throw new Error("Failed to fetch user data");

        const userData = await userRes.json();
        if (!userData.user) throw new Error("No user data found");

        setUser({
          id: userData.user.id,
          fullname: userData.user.fullname || userData.user.username,
          username: userData.user.username,
          role: userData.user.role,
          email: userData.user.email,
          phone: userData.user.phone,
          departmentName: userData.user.departmentName,
        });

        if (
          userData.user.role === "Technician" ||
          userData.user.role === "HOD" ||
          userData.user.role === "Employee"
        ) {
          const statsRes = await fetch(
            `/api/users/${encodeId(userData.user.id)}`,
          );
          if (!statsRes.ok) throw new Error("Failed to fetch stats");

          const statsData = await statsRes.json();
          setStats(statsData.statistics || null);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message={error} />;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">
          <img
            src="/images/demo_person.png"
            alt={user?.fullname}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.fullname}
              </h1>
              <p className="text-gray-500 mt-1">
                {user?.role}
                {(user?.role === "Technician" || user?.role === "HOD") &&
                user.departmentName
                  ? ` - ${user.departmentName}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="font-semibold">Email</p>
              <p>{user?.email || "Not provided"}</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p>{user?.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {stats && user && user.role === "Technician" && (
        <TechnicianStatistics stats={stats} />
      )}
      {stats && user && user.role === "Employee" && (
        <EmployeeStatistics stats={stats} />
      )}
      {stats && user && user.role === "HOD" && <HodStatistics stats={stats} />}
    </div>
  );
}
