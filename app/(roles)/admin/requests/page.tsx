"use client";

import { useEffect, useState } from "react";
import deleteRequest from "@/app/actions/requests/deleteRequest";
import Table from "@/app/components/ui/table/table";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";
import { ServiceRequest } from "@/app/types/requests";

export default function Requests() {
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${url} failed with status ${res.status}`);
    }
    return res.json();
  }

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchJson<ServiceRequest[]>("/api/admin/requests");
        setRequests(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Could not fetch requests" />;
  if (!requests) return <CustomError message="Data not available" />;

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
      <Table
        data={requests}
        rowKey="id"
        rowClickRoute={(row) => `/admin/requests/${row.id}`}
        columns={[
          "no",
          "title",
          "type",
          "department",
          "priority",
          "status",
          "submitted_at",
        ]}
        onDelete={deleteRequest}
      />
    </div>
  );
}
