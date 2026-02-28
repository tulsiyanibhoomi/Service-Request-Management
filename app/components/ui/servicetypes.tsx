"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import ConfirmDeleteModal from "@/app/components/ui/modals/deleteconfirm";
import AddEditServiceTypeModal from "./modals/addeditservicetype";
import addServiceType from "@/app/actions/service-types/addType";
import editServiceType from "@/app/actions/service-types/editType";

type ServiceType = {
  id: number;
  name: string;
  description: string;
};

type Props = {
  serviceTypes: ServiceType[];
  deptName: string;
  deptId: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRefresh?: () => void;
};

export default function ServiceTypes({
  serviceTypes,
  deptName,
  deptId,
  onEdit,
  onDelete,
  onRefresh,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceType | undefined>();

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null && onDelete) {
      onDelete(deleteId);
    }
    setDeleteId(null);
    setIsDeleteOpen(false);
  };

  return (
    <div className="mt-6 bg-white border border-gray-100 rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Service Types</h2>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              isEditing
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          <FaEdit />
          {isEditing ? "Done" : "Manage"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {serviceTypes.map((st) => (
          <div key={st.id} className="relative group">
            <span
              onClick={() => {
                if (isEditing) {
                  setEditingItem(st);
                  setIsAddOpen(true);
                } else {
                  onEdit?.(st.id);
                }
              }}
              className={`flex items-center justify-center px-6 py-3 rounded-full text-base font-medium min-w-[120px] transition
                ${
                  isEditing
                    ? "cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "bg-blue-100 text-blue-800"
                }`}
            >
              {st.name}
            </span>

            {isEditing && (
              <button
                onClick={() => handleDeleteClick(st.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() => {
              setEditingItem(undefined);
              setIsAddOpen(true);
            }}
            className="flex items-center justify-center bg-green-100 text-green-700 px-6 py-3 rounded-full text-base font-medium min-w-[120px] border-2 border-dashed border-green-400 hover:bg-green-200 transition"
          >
            <FaPlus className="mr-2" />
            Add
          </button>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="service type"
      />

      <AddEditServiceTypeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        deptName={deptName}
        initialData={
          editingItem
            ? {
                name: editingItem.name,
                description: editingItem.description || "",
              }
            : undefined
        }
        onSubmit={async (data: any) => {
          if (editingItem) {
            await editServiceType(
              editingItem.id,
              deptId,
              data.name,
              data.description,
            );
            setEditingItem(undefined);
          } else {
            await addServiceType(deptId, data.name, data.description);
          }
          setIsAddOpen(false);
          onRefresh?.();
        }}
      />
    </div>
  );
}
