"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";

type Props = {
  stats: any;
};

export default function EmployeeStatistics({ stats }: Props) {
  const requestData = [
    { name: "Total Requests", value: stats.totalRequests || 0 },
    { name: "Active", value: stats.activeRequests || 0 },
    { name: "Cancelled", value: stats.cancelledRequests || 0 },
    { name: "Closed", value: stats.closedRequests || 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="bg-white p-6 rounded-xl shadow border lg:col-span-2">
        <h3 className="font-semibold mb-4 text-gray-700">Requests Overview</h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={requestData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
