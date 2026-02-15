import { Overview } from "@/app/types/dashboard";
import Table from "./table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ROUTES } from "@/app/config/routes";

type TableAction<T> = {
  name: string;
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  title: React.ReactNode;
  tableTitle?: string;
  overview: Overview;
  tableData: T[];
  tableColumns: string[];
  tableRowKey: keyof T;
  tableRowActions?: TableAction<T>[];
};

export default function CommonDashboard<T>({
  title,
  tableTitle,
  overview,
  tableData,
  tableColumns,
  tableRowKey,
  tableRowActions,
}: Props<T>) {
  const allCards = [
    {
      key: "total",
      title: "Total Requests",
      color: "bg-yellow-100 text-yellow-800",
    },
    { key: "pending", title: "Pending", color: "bg-blue-100 text-blue-800" },
    {
      key: "approved",
      title: "Approved",
      color: "bg-purple-100 text-purple-800",
    },
    {
      key: "in_progress",
      title: "In Progress",
      color: "bg-red-100 text-red-800",
    },
    {
      key: "completed",
      title: "Completed",
      color: "bg-green-100 text-green-800",
    },
  ];

  const cards = allCards
    .filter((card) => overview[card.key as keyof Overview] !== undefined)
    .map((card) => ({
      ...card,
      value: overview[card.key as keyof Overview] as number,
    }));

  const [user, setUser] = useState(null);
  const [redirectURL, setRedirectURL] = useState("/requests");

  useEffect(() => {
    fetch("/api/auth/current-user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);

        if (data.user?.role) {
          const roleKey = data.user.role.toLowerCase();
          const url = (ROUTES.REQUEST_ROUTES as Record<string, string>)[
            roleKey
          ];
          setRedirectURL(url);
        }
      })
      .catch((err) => console.error("Failed to fetch current user:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color ?? "bg-gray-200 text-black"} p-5 rounded-xl shadow`}
          >
            <p className="font-medium">{card.title}</p>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4">
            {tableTitle ? tableTitle : "Requests"}
          </h2>
          <Link
            href={redirectURL}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            View All {tableTitle ? tableTitle : "Requests"}
          </Link>
        </div>
        <div className="overflow-x-auto">
          {tableData.length > 0 ? (
            <Table
              data={tableData}
              columns={tableColumns}
              rowKey={tableRowKey as string}
              rowActions={tableRowActions}
              rowClickRoute={(row) => `${redirectURL}/${row[tableRowKey]}`}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              No{" "}
              {tableTitle ? tableTitle : "Requests"?.toString().toLowerCase()}{" "}
              available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
