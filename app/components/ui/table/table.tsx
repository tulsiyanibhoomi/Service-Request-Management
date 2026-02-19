"use client";

import { ReactNode, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDeleteModal from "@/app/components/ui/deleteconfirm";
import { useRouter } from "next/navigation";
import TableRow from "./table_row";

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

  const CENTERED_COLUMNS = ["roles", "status", "priority", "type"];

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

  return (
    <>
      <Toaster position="top-right" />
      <div className="overflow-x-auto w-full shadow-lg rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnsToRender.map((col, idx) => {
                const isCentered = CENTERED_COLUMNS.includes(col.toLowerCase());
                return (
                  <th
                    key={idx}
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isCentered ? "text-center" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                );
              })}
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
              <TableRow
                key={idx}
                row={row}
                columns={columnsToRender}
                rowKey={rowKey}
                onEdit={onEdit}
                rowActions={rowActions}
                showEditDelete={showEditDelete}
                rowClickRoute={rowClickRoute}
                router={router}
                isDeleting={isDeleting}
                setSelectedData={setSelectedData}
                setIsModalOpen={setIsModalOpen}
              />
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
