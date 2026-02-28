"use client";

import { useEffect, useState } from "react";
import Table from "@/app/components/ui/table/table";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { useRouter } from "next/navigation";

type User = {
  userid: number;
  username: string;
  fullname: string;
  email: string;
  role: string;
  created: string;
  modified: string;
};

type Role = {
  id: number;
  rolename: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} failed with status ${res.status}`);
    return res.json();
  }

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<User[]>("/api/users/list");
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await fetchJson<Role[]>("/api/roles/list");
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message={error} />;
  if (!users) return <CustomError message="No user data available" />;

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => router.push("/admin/users/add")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Add User
        </button>
      </div>

      <Table
        data={users}
        columns={["userid", "fullname", "username", "email", "roles"]}
        rowKey="userid"
        rowClickRoute={(row) => `/admin/users/${row.userid}`}
      />
    </div>
  );
}
