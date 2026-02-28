"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { formatDate } from "@/app/components/utils/styles";
import {
  FaUserTie,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import DepartmentHeader from "@/app/components/ui/detailsheader";
import InfoCard from "@/app/components/ui/detailsinfocard";
import ServiceTypes from "@/app/components/ui/servicetypes";
import ConfirmDeleteModal from "@/app/components/ui/deleteconfirm";
import deleteServiceType from "@/app/actions/service-types/deleteType";
import AddEditDeptModal from "@/app/components/ui/addeditdept";
import editServiceDepartment from "@/app/actions/departments/editDepartment";
import deleteDepartment from "@/app/actions/departments/deleteDepartment";

type ServiceType = {
  id: number;
  name: string;
  description: string;
};

type DepartmentDetail = {
  service_dept_id: number;
  service_dept_name: string;
  description: string | null;
  cc_email_to_csv: string | null;
  created: string;
  modified: string;
  hodName: string | null;
  service_types: ServiceType[];
};

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDepartment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/departments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch department");
      const data = await res.json();
      setDepartment(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const handleDeleteServiceType = async (serviceTypeId: number) => {
    try {
      const res = await deleteServiceType(serviceTypeId, Number(id));
      if (!res.success)
        throw new Error(res.message || "Failed to delete service type");
      await fetchDepartment();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete service type");
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await deleteDepartment(Number(id));
    } catch (err: any) {
      console.error("Failed to delete department:", err);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message={error} />;
  if (!department) return <CustomError message="Department not found" />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <DepartmentHeader
        name={department.service_dept_name}
        onEdit={handleEdit}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <InfoCard
          icon={<FaInfoCircle className="text-blue-600" />}
          title="Description"
          value={department.description ?? "No description provided"}
        />
        <InfoCard
          icon={<FaUserTie className="text-green-600" />}
          title="HOD"
          value={department.hodName ?? "N/A"}
        />
        <InfoCard
          icon={<FaEnvelope className="text-purple-600" />}
          title="CC Emails"
          value={department.cc_email_to_csv ?? "N/A"}
        />
        <InfoCard
          icon={<FaCalendarAlt className="text-indigo-600" />}
          title="Created At"
          value={formatDate(department.created)}
        />
        <InfoCard
          icon={<FaCalendarAlt className="text-red-600" />}
          title="Last Modified"
          value={formatDate(department.modified)}
        />
      </div>

      <ServiceTypes
        serviceTypes={department.service_types}
        deptName={department.service_dept_name}
        deptId={department.service_dept_id}
        onDelete={handleDeleteServiceType}
        onRefresh={fetchDepartment}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteDepartment}
        itemName="department"
      />

      <AddEditDeptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          deptName: department.service_dept_name,
          description: department.description ?? "",
          cc_email_to_csv: department.cc_email_to_csv ?? "",
        }}
        onSubmit={async (data) => {
          await editServiceDepartment(
            department.service_dept_id,
            data.deptName,
            data.description,
            data.cc_email_to_csv,
          );
          setIsModalOpen(false);
          await fetchDepartment();
        }}
      />
    </div>
  );
}
