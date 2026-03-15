"use client";

import { ReactNode, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDeleteModal from "@/app/components/ui/modals/deleteconfirm";
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
  enableSearch?: boolean;
}

interface DepartmentOption {
  id: string | number;
  name: string;
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
  enableSearch = true,
}: TableProps) {
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [filters, setFilters] = useState<Record<string, string>>({
    priority: "",
    status: "",
    department: "",
    type: "",
  });

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [statuses, setStatuses] = useState<
    { id: string | number; name: string }[]
  >([]);

  const router = useRouter();
  const CENTERED_COLUMNS = [
    "roles",
    "status",
    "priority",
    "type",
    "availability_status",
  ];

  const FILTER_COLUMNS = [
    "priority",
    "status",
    "department",
    "roles",
    "availability_status",
  ];

  useEffect(() => {
    async function fetchFilterData() {
      try {
        const deptRes = await fetch("/api/departments");
        const deptData: DepartmentOption[] = await deptRes.json();
        setDepartments(deptData);

        const statusRes = await fetch("/api/request-status/id_name");
        const statusData: { id: string | number; name: string }[] =
          await statusRes.json();
        setStatuses(statusData);
      } catch (err) {
        console.error("Error fetching filter data", err);
      }
    }
    fetchFilterData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let tempData = [...tableData];
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      tempData = tempData.filter((row) =>
        Object.values(row).some(
          (v) => v && String(v).toLowerCase().includes(lower),
        ),
      );
    }
    Object.entries(filters).forEach(([col, value]) => {
      if (value) tempData = tempData.filter((row) => row[col] === value);
    });

    setFilteredData(tempData);
  }, [debouncedSearch, tableData, filters]);

  useEffect(() => {
    setTableData(data);
    setFilteredData(data);
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
      await onDelete(selectedData[rowKey]);
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
      <div className="w-full">
        {enableSearch && tableData.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg border border-gray-200 mb-3">
            <div className="relative w-full max-w-sm flex-shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search table..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50
                 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition placeholder-gray-400 text-gray-700"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {columnsToRender.map((col) => {
                const lowerCol = col.toLowerCase();
                if (!FILTER_COLUMNS.includes(lowerCol)) return null;

                let options: string[] | DepartmentOption[] = [];
                if (lowerCol === "priority")
                  options = ["High", "Medium", "Low"];
                if (lowerCol === "status") options = statuses;
                if (lowerCol === "department") options = departments;
                if (lowerCol === "roles")
                  options = ["Admin", "HOD", "Technician", "Employee"];
                if (lowerCol === "availability_status")
                  options = ["available", "busy"];

                return (
                  <div key={col} className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">
                      {col.charAt(0).toUpperCase() + col.slice(1).toLowerCase()}
                    </label>
                    <select
                      value={filters[lowerCol]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [lowerCol]: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50
                     text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-blue-500 transition hover:bg-gray-100"
                    >
                      <option value="">All</option>
                      {(options ?? []).map((opt) => {
                        if (typeof opt === "string") {
                          return (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          );
                        }
                        return (
                          <option key={opt.id} value={opt.name}>
                            {opt.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })}

              {Object.values(filters).some((val) => val) && (
                <button
                  onClick={() =>
                    setFilters({ priority: "", status: "", department: "" })
                  }
                  className="self-end px-4 py-2 bg-red-500 text-white rounded-lg
                 shadow-sm hover:bg-red-600 transition text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columnsToRender.map((col) => {
                  const isCentered = CENTERED_COLUMNS.includes(
                    col.toLowerCase(),
                  );
                  return (
                    <th
                      key={col}
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isCentered ? "text-center" : "text-left"
                      }`}
                    >
                      {col}
                    </th>
                  );
                })}
                {rowActions?.map((action) => (
                  <th
                    key={action.name}
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
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <TableRow
                    key={row[rowKey] ?? idx}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columnsToRender.length +
                      (rowActions?.length || 0) +
                      (showEditDelete ? 2 : 0)
                    }
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Showing {filteredData.length} of {tableData.length} rows
          </div>{" "}
        </div>
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
