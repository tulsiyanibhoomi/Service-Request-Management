"use client";

import { ReactNode, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDeleteModal from "@/app/components/ui/deleteconfirm";
import { useRouter } from "next/navigation";

interface TableProps {
  data: any[];
  columns?: string[];
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => Promise<{ success: boolean; message?: string }>;
  rowKey: string;
  rowClickRoute?: (row: any) => string;
  rowActions?: {
    name: string;
    render: (row: any) => ReactNode;
  }[];
  showEditDelete?: boolean;
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const HIDDEN_COLUMNS = ["password", "created", "modified", "isactive"];

export default function Table({
  data,
  columns,
  onEdit,
  onDelete,
  rowKey,
  rowClickRoute,
  rowActions,
  showEditDelete,
}: TableProps) {
  const [tableData, setTableData] = useState(data);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columnsToRender =
    columns && columns.length > 0
      ? columns
      : tableData.length > 0
        ? Object.keys(tableData[0]).filter((col) => {
            const lowerCol = col.toLowerCase();
            if (HIDDEN_COLUMNS.includes(lowerCol)) return false;
            if (
              rowKey !== "userid" &&
              (lowerCol === "userid" || lowerCol === "users")
            )
              return false;
            return true;
          })
        : [];

  const handleDelete = async () => {
    if (!selectedData || !onDelete) return;
    setIsDeleting(true);

    try {
      const result = await onDelete(selectedData[rowKey]);
      if (result.success) {
        toast.success("Deleted successfully ✅");
        setTableData((prev) =>
          prev.filter((u) => u[rowKey] !== selectedData[rowKey]),
        );
      } else {
        toast.error(result.message || "Failed to delete ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred ❌");
    } finally {
      setIsDeleting(false);
      setSelectedData(null);
    }
  };

  function formatValue(value: any) {
    if (value === undefined || value === null) return "-";
    return String(value);
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="overflow-x-auto w-full shadow-lg rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnsToRender.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              {rowActions?.map((action, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {action.name}
                </th>
              ))}

              {showEditDelete && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Edit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Delete
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-gray-100 transition-colors duration-200 ${rowClickRoute ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (rowClickRoute) {
                    router.push(rowClickRoute(row));
                  }
                }}
              >
                {columnsToRender.map((col, i) => {
                  const value = row[col];
                  if (col.toLowerCase() === "roles" && value) {
                    return (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            value === "Admin"
                              ? "bg-red-500 text-white"
                              : value === "HOD"
                                ? "bg-blue-500 text-white"
                                : value === "Technician"
                                  ? "bg-purple-500 text-white"
                                  : "bg-gray-300 text-gray-800"
                          }`}
                        >
                          {formatValue(value)}
                        </span>
                      </td>
                    );
                  }
                  if (col.toLowerCase() === "status") {
                    let bgColor =
                      "bg-gray-100 text-gray-800 border border-gray-300";

                    if (value?.toLowerCase() === "pending")
                      bgColor =
                        "bg-yellow-100 text-yellow-800 border-yellow-400";
                    else if (value?.toLowerCase() === "approved")
                      bgColor =
                        "bg-purple-100 text-purple-800 border-purple-400";
                    else if (value?.toLowerCase() === "in progress")
                      bgColor = "bg-blue-100 text-blue-800 border-blue-400";
                    else if (value?.toLowerCase() === "completed")
                      bgColor = "bg-green-100 text-green-800 border-green-400";
                    else if (value?.toLowerCase() === "closed")
                      bgColor = "bg-gray-200 text-gray-700 border-gray-400";
                    else if (value?.toLowerCase() === "declined")
                      bgColor = "bg-red-100 text-red-800 border-red-400";

                    return (
                      <td
                        key={i}
                        className="px-3 py-2 whitespace-nowrap text-sm"
                      >
                        <span
                          className={`px-3 py-1 rounded-full font-semibold border ${bgColor}`}
                        >
                          {formatValue(value)}
                        </span>
                      </td>
                    );
                  }
                  if (col.toLowerCase() === "priority") {
                    let bgColor = "bg-gray-300 text-gray-800";
                    if (value?.toLowerCase() === "high")
                      bgColor = "bg-red-500 text-white";
                    else if (value?.toLowerCase() === "medium")
                      bgColor = "bg-yellow-500 text-white";
                    else if (value?.toLowerCase() === "low")
                      bgColor = "bg-green-500 text-white";

                    return (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${bgColor}`}
                        >
                          {formatValue(value)}
                        </span>
                      </td>
                    );
                  }
                  if (
                    col.toLowerCase() === "submitted_at" ||
                    col.toLowerCase() === "modified_at" ||
                    col.toLowerCase() === "modified" ||
                    col.toLowerCase() === "date"
                  ) {
                    return (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {formatDate(value)}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {formatValue(value)}
                    </td>
                  );
                })}

                {rowActions?.map((action, idx) => (
                  <td key={idx} className="px-3 py-2">
                    {action.render(row)}
                  </td>
                ))}

                {showEditDelete && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(row);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedData(row);
                          setIsModalOpen(true);
                        }}
                        disabled={isDeleting}
                        className={`bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedData?.name || "item"}
      />
    </>
  );
}
