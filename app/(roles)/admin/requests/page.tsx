"use client";

import deleteRequest from "@/app/actions/requests/deleteRequest";
import Table from "@/app/components/ui/table/table";
import { ServiceRequest } from "@/app/types/requests";
import { useEffect, useState } from "react";

export default function Requests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    fetch("/api/admin/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
      });
  }, []);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
      <Table
        data={requests}
        rowKey="service_request_id"
        rowClickRoute={(row) => `/admin/requests/${row.service_request_id}`}
        columns={[
          "no",
          "title",
          "type",
          "department",
          "priority",
          "status",
          "created_at",
        ]}
        onDelete={deleteRequest}
      />
    </div>
  );
}
