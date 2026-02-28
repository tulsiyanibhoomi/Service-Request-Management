"use client";

import { useEffect, useState } from "react";
import deleteDepartment from "@/app/actions/departments/deleteDepartment";
import addDepartment from "@/app/actions/departments/addDepartment";
import Table from "@/app/components/ui/table/table";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import AddEditDeptModal from "@/app/components/ui/addeditdept";

type Department = {
  service_dept_id: number;
  service_dept_name: string;
  description: string;
  cc_email_to_csv: string;
  userid: number;
  created: string;
  modified: string;
  username: string;
};

export default function Departments() {
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${url} failed with status ${res.status}`);
    }
    return res.json();
  }

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<Department[]>("/api/departments/list");
      setDepartments(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Could not fetch departments" />;
  if (!departments) return <CustomError message="Data not available" />;

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Add Department
        </button>
      </div>

      <Table
        data={departments}
        rowKey="service_dept_id"
        rowClickRoute={(row) => `/admin/departments/${row.id}`}
      />

      <AddEditDeptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await addDepartment(
            data.deptName,
            data.description == "" ? null : data.description,
            data.cc_email_to_csv == "" ? null : data.cc_email_to_csv,
          );
          setIsModalOpen(false);
          await fetchDepartments();
        }}
      />
    </div>
  );
}
