"use client";

import { useEffect, useState } from "react";
import Table from "@/app/components/ui/table/table";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";
import { useRouter } from "next/navigation";

interface Technician {
  technicianId: number;
  fullname: string;
  username: string;
  email: string;
  roles: string;
  isactive: boolean;
}

interface CurrentUserResponse {
  id: number;
  fullname: string;
  username: string;
  email: string;
  role: string;
  departmentId: number | null;
}

export default function HODTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  const router = useRouter();

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`${url} failed with status ${res.status}`);
    return res.json();
  }

  useEffect(() => {
    const fetchHodAndTechnicians = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchJson<{ user: CurrentUserResponse }>(
          "/api/auth/current-user",
        );
        const hodData = response.user;
        if (!hodData.departmentId) {
          setError("Department info not found");
          setLoading(false);
          return;
        }
        setDepartmentId(hodData.departmentId);
        const techData = await fetchJson<Technician[]>(
          `/api/hod/technicians/${hodData.departmentId}`,
        );
        setTechnicians(techData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch technicians");
      } finally {
        setLoading(false);
      }
    };
    fetchHodAndTechnicians();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message={error} />;
  if (!technicians || technicians.length === 0)
    return <CustomError message="No technicians found in your department" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Technicians</h2>
          <button
            onClick={() => router.push("/hod/technicians/add")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Technician
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            data={technicians}
            columns={[
              "fullname",
              "username",
              "email",
              "max_requests_allowed",
              "currently_assigned",
              "availability_status",
            ]}
            rowKey="technicianId"
            rowClickRoute={(row) => `/hod/technicians/${row.technicianId}`}
          />
        </div>
      </div>
    </div>
  );
}
