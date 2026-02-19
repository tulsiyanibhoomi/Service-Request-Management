"use client";

import { useState } from "react";
import Link from "next/link";
import { ServiceRequest } from "@/app/types/requests";
import HODDecisionModal from "./modals/hoddecisionmodal";
import TechnicianDecisionModal from "./modals/techniciandecisionmodal";
import RequestInfo from "./details_parts/requestinfo";
import RequestStatus from "./details_parts/requeststatus";
import RequestAssignment from "./details_parts/requestassignment";
import RequestTimeStamps from "./details_parts/requesttimestamps";
import TechnicianActions from "./actions/technicianactions";
import HODAdminActions from "./actions/hodadminactions";
import RequestAttachments from "./details_parts/requestattachments";
import EmployeeActions from "./actions/employeeactions";
import { HodAction, TechnicianAction } from "@/app/types/role_actions";

interface RequestDetailsProps {
  data: ServiceRequest;
  backLink?: string;
  role: "Employee" | "HOD" | "Admin" | "Technician";
}

export default function RequestDetails({
  data,
  backLink = "/requests",
  role,
}: RequestDetailsProps) {
  const canDecide = role === "HOD" || role === "Admin";

  const [hodModalOpen, setHodModalOpen] = useState(false);
  const [technicianModalOpen, setTechnicianModalOpen] = useState(false);

  const [hodAction, setHodAction] = useState<HodAction>("Approve");
  const [technicianAction, setTechnicianAction] =
    useState<TechnicianAction | null>(null);

  const handleHODAdminAction = (action: HodAction) => {
    setHodAction(action);
    setHodModalOpen(true);
  };

  const handleTechnicianAction = (action: TechnicianAction) => {
    setTechnicianAction(action);
    setTechnicianModalOpen(true);
  };

  const isPending = data.status === "Pending";
  const noAction =
    data.status === "Cancelled" ||
    data.status === "Completed" ||
    data.status === "Closed" ||
    data.status === "Declined";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Request #{data.no}</h1>
        <Link
          href={backLink}
          className="bg-white text-indigo-800 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <RequestInfo data={data} />

          {data.attachments && data.attachments.length > 0 && (
            <RequestAttachments data={data} />
          )}
        </div>

        <div className="space-y-6">
          <RequestStatus data={data} />
          {!noAction && canDecide && (
            <HODAdminActions data={data} onAction={handleHODAdminAction} />
          )}
          {!noAction && role === "Employee" && <EmployeeActions data={data} />}
          {!noAction && role === "Technician" && (
            <TechnicianActions data={data} onAction={handleTechnicianAction} />
          )}
          {!isPending && role !== "Technician" && (
            <RequestAssignment data={data} />
          )}
          {data.status_history &&
            Object.keys(data.status_history).length > 0 && (
              <RequestTimeStamps data={data} />
            )}{" "}
        </div>
      </div>

      {hodModalOpen && role !== "Technician" && (
        <HODDecisionModal
          request={data}
          action={hodAction}
          onClose={() => setHodModalOpen(false)}
        />
      )}
      {technicianModalOpen && role === "Technician" && (
        <TechnicianDecisionModal
          technicianId={data.assigned_to_userid!}
          requestId={data.service_request_id}
          currentStatus={
            data.status as "Approved" | "In Progress" | "Completed" | "Closed"
          }
          action={technicianAction ?? "Complete"}
          onClose={() => setTechnicianModalOpen(false)}
        />
      )}
    </div>
  );
}
