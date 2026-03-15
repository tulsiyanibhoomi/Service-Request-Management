"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Table from "@/app/components/ui/table/table";
import AddEditServiceStatusModal from "@/app/components/ui/modals/addeditreqstatus";
import deleteRequestStatus from "@/app/actions/request-status/deleteStatus";
import addServiceRequestStatus from "@/app/actions/request-status/addStatus";
import editServiceRequestStatus from "@/app/actions/request-status/editStatus";
import {
  showErrorAlert,
  showPositiveAlert,
} from "@/app/components/utils/showAlert";

type RequestStatus = {
  id: number;
  status_name: string;
  description: string;
};

export default function Requests() {
  const [status, setStatus] = useState<RequestStatus[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<RequestStatus | null>(
    null,
  );

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/request-status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch status");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubmit = async (data: {
    statusName: string;
    description: string;
  }) => {
    try {
      if (editingStatus) {
        const result = await editServiceRequestStatus(
          editingStatus.id,
          data.statusName,
          data.description,
        );
        if (result.type === "error") showErrorAlert(result.message);
        if (result.type === "success") showPositiveAlert(result.message);
      } else {
        const result = await addServiceRequestStatus(
          data.statusName,
          data.description || null,
        );
        if (result.type === "error") showErrorAlert(result.message);
        if (result.type === "success") showPositiveAlert(result.message);
      }
      setModalOpen(false);
      setEditingStatus(null);
      fetchStatus();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save status");
    }
  };

  const handleEdit = (row: RequestStatus) => {
    setEditingStatus(row);
    setModalOpen(true);
  };

  return (
    <div className="p-6 w-full">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Request Status</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={() => {
            setEditingStatus(null);
            setModalOpen(true);
          }}
        >
          Add Status
        </button>
      </div>

      <Table
        data={status}
        rowKey="id"
        showEditDelete
        columns={["status_name", "description", "request_count"]}
        onEdit={handleEdit}
        onDelete={async (id: number) => {
          const result = await deleteRequestStatus(id);
          if (result.type === "error") showErrorAlert(result.message);
          if (result.type === "success") showPositiveAlert(result.message);
          fetchStatus();
          return { success: true, message: result.message };
        }}
      />

      <AddEditServiceStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={
          editingStatus
            ? {
                statusName: editingStatus.status_name,
                description: editingStatus.description,
              }
            : undefined
        }
      />
    </div>
  );
}
