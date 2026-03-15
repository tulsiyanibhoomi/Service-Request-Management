"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";
import { formatDate } from "@/app/components/utils/styles";
import { FaUser, FaIdBadge, FaCalendarAlt, FaUserCog } from "react-icons/fa";

import InfoCard from "@/app/components/ui/admin-details/detailsinfocard";
import ConfirmDeleteModal from "@/app/components/ui/modals/deleteconfirm";
import deleteUser from "@/app/actions/users/deleteUser";
import DetailsHeader from "@/app/components/ui/admin-details/detailsheader";
import TechnicianStatistics from "@/app/components/ui/admin-details/techstat";
import HodStatistics from "@/app/components/ui/admin-details/hodstat";
import EmployeeStatistics from "@/app/components/ui/admin-details/employeestat";
import {
  showErrorAlert,
  showPositiveAlert,
} from "@/app/components/utils/showAlert";
import { decodeId } from "@/app/components/utils/url";

type UserStatistics = {
  completedRequests?: number;
  activeRequests?: number;
  maxAllowedRequests?: number;
  averageCompletionDays?: number;

  totalRequests?: number;
  closedRequests?: number;

  totalDeptRequests?: number;
  approvedRequests?: number;
  technicianCount?: number;
};

type UserDetail = {
  userid: number;
  username: string;
  fullname: string;
  email: string;
  role: string;
  created: string;
  modified: string;
  statistics?: UserStatistics;
  departmentName?: string;
};

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const decodedId = id ? decodeId(id) : null;
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleDeleteUser = async () => {
    try {
      const result = await deleteUser(Number(decodedId));

      if (result.type === "error") showErrorAlert(result.message);
      router.push("/admin/users");
      if (result.type === "success") showPositiveAlert(result.message);
    } catch (err: any) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/users/add?id=${id}`);
  };

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message={error} />;
  if (!user) return <CustomError message="User not found" />;

  const stats = user.statistics;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <DetailsHeader
        name={user.fullname}
        departmentName={user.departmentName}
        onEdit={handleEdit}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <InfoCard
          icon={<FaUser className="text-blue-600" />}
          title="Username"
          value={user.username}
        />
        <InfoCard
          icon={<FaIdBadge className="text-green-600" />}
          title="Full Name"
          value={user.fullname}
        />
        <InfoCard
          icon={<FaUserCog className="text-purple-600" />}
          title="Role"
          value={user.role}
        />
        <InfoCard
          icon={<FaCalendarAlt className="text-indigo-600" />}
          title="Joined on"
          value={formatDate(user.created)}
        />
      </div>

      {stats && user.role === "Technician" && (
        <TechnicianStatistics stats={stats} />
      )}
      {stats && user.role === "HOD" && <HodStatistics stats={stats} />}
      {stats && user.role === "Employee" && (
        <EmployeeStatistics stats={stats} />
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteUser}
        itemName="user"
      />
    </div>
  );
}
