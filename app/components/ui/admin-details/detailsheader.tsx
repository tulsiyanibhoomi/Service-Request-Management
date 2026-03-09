"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function DetailsHeader({ name, onEdit, onDelete }: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="mt-2 text-blue-100">Department Details Overview</p>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}
