"use client";

import deleteRequest from "@/app/actions/requests/deleteRequest";
import Table from "@/app/components/ui/table/table";
import { ROUTES } from "@/app/config/routes";
import { ServiceRequest } from "@/app/types/requests";
import Link from "next/link";
import { useEffect, useState } from "react";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";

export default function EmployeeRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/employee/requests");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Could not fetch requests" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Requests</h2>

          <Link
            href={ROUTES.RAISEREQUEST}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition"
          >
            Raise a request
          </Link>
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
              "submitted_at",
            ]}
            rowKey="service_request_id"
            rowClickRoute={(row) =>
              `/employee/requests/${row.service_request_id}`
            }
            onDelete={deleteRequest}
          />
        </div>
      </div>
    </div>
  );
}
