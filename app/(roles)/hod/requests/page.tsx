"use client";

import { useEffect, useState } from "react";
import deleteRequest from "@/app/actions/requests/deleteRequest";
import Table from "@/app/components/ui/table/table";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { ServiceRequest } from "@/app/types/requests";

export default function HODRequests() {
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} failed with status ${res.status}`);
    return res.json();
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchJson<ServiceRequest[]>(
          "/api/hod/requests"
        );
        setRequests(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Could not fetch requests" />;
  if (!requests) return <CustomError message="Data not available" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table
            data={requests}
            columns={[
              "no",
              "title",
              "type",
              "priority",
              "status",
              "assigned_to",
            ]}
            rowKey="service_request_id"
            rowClickRoute={(row) =>
              `/hod/requests/${row.service_request_id}`
            }
            onDelete={deleteRequest}
          />
        </div>
      </div>
    </div>
  );
}