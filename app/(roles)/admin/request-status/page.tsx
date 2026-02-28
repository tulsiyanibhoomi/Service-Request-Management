"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Table from "@/app/components/ui/table/table";
import AddEditServiceStatusModal from "@/app/components/ui/modals/addeditreqstatus";
import deleteRequestStatus from "@/app/actions/request-status/deleteStatus";
import addServiceRequestStatus from "@/app/actions/request-status/addStatus";
import editServiceRequestStatus from "@/app/actions/request-status/editStatus";

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
      const res = await fetch("/api/request-status/list");
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
        await editServiceRequestStatus(
          editingStatus.id,
          data.statusName,
          data.description,
        );

        toast.success("Status updated successfully");
      } else {
        const result = await addServiceRequestStatus(
          data.statusName,
          data.description || null,
        );

        if (!result.success) {
          toast.error(result.message || "Failed to add status");
          return;
        }
        toast.success("Status added successfully");
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
        onEdit={handleEdit}
        onDelete={async (id: number) => {
          const result = await deleteRequestStatus(id);
          if (result.success) {
            setStatus((prev) => prev.filter((s) => s.id !== id));
          }
          return result;
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
