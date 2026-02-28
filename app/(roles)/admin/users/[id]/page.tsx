"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { formatDate } from "@/app/components/utils/styles";
import { FaUser, FaIdBadge, FaCalendarAlt, FaUserCog } from "react-icons/fa";

import InfoCard from "@/app/components/ui/detailsinfocard";
import ConfirmDeleteModal from "@/app/components/ui/modals/deleteconfirm";
import deleteUser from "@/app/actions/users/deleteUser";
import DetailsHeader from "@/app/components/ui/detailsheader";

type UserDetail = {
  userid: number;
  username: string;
  fullname: string;
  email: string;
  role: string;
  created: string;
  modified: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter(); // add router
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
      await deleteUser(Number(id));
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <DetailsHeader
        name={user.fullname}
        onEdit={handleEdit}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          title="Created At"
          value={formatDate(user.created)}
        />
        <InfoCard
          icon={<FaCalendarAlt className="text-red-600" />}
          title="Last Modified"
          value={formatDate(user.modified)}
        />
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteUser}
        itemName="user"
      />
    </div>
  );
}
