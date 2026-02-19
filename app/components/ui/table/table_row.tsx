"use client";

import {
  formatDate,
  formatValue,
  priorityGradient,
  statusGradient,
} from "@/app/components/utils/styles";
import { ReactNode } from "react";

interface TableRowProps {
  row: any;
  columns: string[];
  rowKey: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showEditDelete?: boolean;
  rowActions?: { name: string; render: (row: any) => ReactNode }[];
  rowClickRoute?: (row: any) => string;
  router: any;
  isDeleting?: boolean;
  setSelectedData?: (row: any) => void;
  setIsModalOpen?: (open: boolean) => void;
}

export default function TableRow({
  row,
  columns,
  rowKey,
  onEdit,
  showEditDelete,
  rowActions,
  rowClickRoute,
  router,
  isDeleting,
  setSelectedData,
  setIsModalOpen,
}: TableRowProps) {
  return (
    <tr
      className={`hover:bg-gray-100 transition-colors duration-200 ${
        rowClickRoute ? "cursor-pointer" : ""
      }`}
      onClick={() => rowClickRoute && router.push(rowClickRoute(row))}
    >
      {columns.map((col, i) => {
        const value = row[col];

        const isCentered =
          ["roles", "status", "priority", "type"].includes(col.toLowerCase()) ||
          value === "-";

        const baseTdClass = `px-6 py-4 whitespace-nowrap text-sm ${
          isCentered ? "text-center" : "text-left text-gray-700"
        }`;

        if (col.toLowerCase() === "roles" && value) {
          return (
            <td key={i} className={baseTdClass}>
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

        if (col.toLowerCase() === "type") {
          return (
            <td key={i} className={baseTdClass}>
              {formatValue(value)}
            </td>
          );
        }

        if (col.toLowerCase() === "status") {
          return (
            <td key={i} className={baseTdClass}>
              <span
                className={`px-3 py-1 rounded-full font-semibold border ${statusGradient(
                  value,
                )}`}
              >
                {formatValue(value)}
              </span>
            </td>
          );
        }

        if (col.toLowerCase() === "priority") {
          return (
            <td key={i} className={baseTdClass}>
              <span
                className={`px-3 py-1 rounded-full font-semibold ${priorityGradient(value)}`}
              >
                {formatValue(value)}
              </span>
            </td>
          );
        }

        if (
          ["submitted_at", "modified_at", "modified", "date"].includes(
            col.toLowerCase(),
          )
        ) {
          return (
            <td key={i} className={baseTdClass}>
              {formatDate(value)}
            </td>
          );
        }

        return (
          <td key={i} className={baseTdClass}>
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
                setSelectedData?.(row);
                setIsModalOpen?.(true);
              }}
              disabled={isDeleting}
              className={`bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Delete
            </button>
          </td>
        </>
      )}
    </tr>
  );
}
