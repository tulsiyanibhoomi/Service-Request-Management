"use client";
import deleteRequest from "@/app/actions/requests/deleteRequest";
import Table from "@/app/components/ui/table";
import { ServiceRequest } from "@/app/types/requests";
import { useEffect, useState } from "react";

export default function HODRequests() {

  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    fetch("/api/hod/requests").then((res) => res.json()).then(setRequests);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <Table
            data={requests}
            columns={['no', 'title', 'type', 'priority', 'status', 'created_at']}
            rowKey='service_request_id'
            rowClickRoute={(row) => `/hod/requests/${row.service_request_id}`}
            onDelete={deleteRequest}
          />
        </div>
      </div>
    </div>
  );
} 