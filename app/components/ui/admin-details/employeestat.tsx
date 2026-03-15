"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

type Props = {
  stats: any;
};

export default function EmployeeStatistics({ stats }: Props) {
  console.log(stats);
  const requestData = [
    { name: "Pending", value: stats.pendingRequests || 0 },
    { name: "Active", value: stats.activeRequests || 0 },
    { name: "Completed", value: stats.completedRequests || 0 },
    { name: "Declined", value: stats.declinedRequests || 0 },
    { name: "Cancelled", value: stats.cancelledRequests || 0 },
    { name: "Closed", value: stats.closedRequests || 0 },
  ];

  const COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#f43f5e",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="bg-white p-6 rounded-xl shadow border lg:col-span-2">
        <h3 className="font-semibold mb-4 text-gray-700">Requests Breakdown</h3>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={requestData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {requestData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center text-gray-700 font-semibold">
          Total Requests: {stats.totalRequests || 0}
        </div>
      </div>
    </div>
  );
}
