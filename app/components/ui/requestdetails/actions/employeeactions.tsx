"use client";

import { useState } from "react";
import { ServiceRequest } from "@/app/types/requests";
import { useRouter } from "next/navigation";
import EmployeeCancelModal from "../modals/employeedecisionmodal";

export default function EmployeeActions({ data }: { data: ServiceRequest }) {
  const router = useRouter();

  const editableStatuses = ["Pending", "Approved", "In Progress"];
  const canEdit = editableStatuses.includes(data.status);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [action, setAction] = useState<"Cancel" | null>(null);

  if (!canEdit) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Request Actions
        </h2>
        <p className="text-sm text-gray-500">
          This request cannot be modified or cancelled.
        </p>
      </div>
    );
  }

  const handleModify = () => {
    router.push(`/employee/requests/new?requestId=${data.service_request_id}`);
  };

  const handleCancel = () => {
    setAction("Cancel");
    setCancelModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Actions</h2>
        <div className="flex flex-col gap-4">
          <button
            className="px-5 py-2 rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition"
            onClick={handleModify}
          >
            Modify Request
          </button>

          <button
            className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
            onClick={handleCancel}
          >
            Cancel Request
          </button>
        </div>
      </div>

      {cancelModalOpen && action === "Cancel" && (
        <EmployeeCancelModal
          request={data}
          onClose={() => setCancelModalOpen(false)}
        />
      )}
    </>
  );
}
