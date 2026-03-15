"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";
import { formatDate } from "@/app/components/utils/styles";
import {
  FaUserTie,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import InfoCard from "@/app/components/ui/admin-details/detailsinfocard";
import ServiceTypes from "@/app/components/ui/servicetypes";
import ConfirmDeleteModal from "@/app/components/ui/modals/deleteconfirm";
import deleteServiceType from "@/app/actions/service-types/deleteType";
import AddEditDeptModal from "@/app/components/ui/modals/addeditdept";
import editServiceDepartment from "@/app/actions/departments/editDepartment";
import deleteDepartment from "@/app/actions/departments/deleteDepartment";
import DetailsHeader from "@/app/components/ui/admin-details/detailsheader";
import {
  showErrorAlert,
  showPositiveAlert,
} from "@/app/components/utils/showAlert";
import Table from "@/app/components/ui/table/table";
import { decodeId, encodeId } from "@/app/components/utils/url";

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
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const decodedId = id ? decodeId(id) : null;
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [technicians, setTechnicians] = useState<any[]>([]);
  const [techLoading, setTechLoading] = useState(true);
  const [techError, setTechError] = useState<string | null>(null);

  const router = useRouter();

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

  const fetchTechnicians = async () => {
    setTechLoading(true);
    setTechError(null);
    try {
      const res = await fetch(`/api/departments/${id}/technicians`);
      if (!res.ok) throw new Error("Failed to fetch technicians");
      const data = await res.json();
      setTechnicians(data);
    } catch (err: any) {
      console.error(err);
      setTechError(err.message || "Failed to fetch technicians");
    } finally {
      setTechLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
    if (id) fetchTechnicians();
  }, [id]);

  const handleDeleteServiceType = async (serviceTypeId: number) => {
    try {
      const result = await deleteServiceType(serviceTypeId, Number(id));
      await fetchDepartment();
      if (result.type === "error") showErrorAlert(result.message);
      if (result.type === "success") showPositiveAlert(result.message);
    } catch (err: any) {
      console.error(err);
      showErrorAlert(err.message || "Failed to delete service type");
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      const result = await deleteDepartment(Number(decodedId));
      if (result.type === "error") showErrorAlert(result.message);
      if (result.type === "success") showPositiveAlert(result.message);

      router.push("/admin/departments");
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
      <DetailsHeader
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

      <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Technicians</h2>
          <button
            onClick={() => router.push(`/admin/users/add`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Technician
          </button>
        </div>{" "}
        {techLoading ? (
          <SkeletonCard />
        ) : techError ? (
          <CustomError message={techError} />
        ) : technicians.length === 0 ? (
          <p className="text-gray-500">
            No technicians associated with this department.
          </p>
        ) : (
          <Table
            data={technicians}
            rowKey="id"
            columns={["name", "email", "max_requests_allowed"]}
            enableSearch={false}
            rowClickRoute={(row) => `/admin/users/${encodeId(row.id)}`}
            showEditDelete={false}
          />
        )}
      </div>

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
          const result = await editServiceDepartment(
            department.service_dept_id,
            data.deptName,
            data.description,
            data.cc_email_to_csv,
          );
          setIsModalOpen(false);
          await fetchDepartment();
          if (result.type === "error") showErrorAlert(result.message);
          if (result.type === "success") showPositiveAlert(result.message);
        }}
      />
    </div>
  );
}
