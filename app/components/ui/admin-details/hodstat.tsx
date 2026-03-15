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

export default function HodStatistics({ stats }: Props) {
  const requestData = [
    { name: "Total Requests", value: stats.totalDeptRequests || 0 },
    { name: "Pending", value: stats.pendingRequests || 0 },
    { name: "Active", value: stats.activeRequests || 0 },
    { name: "Completed", value: stats.completedRequests || 0 },
    { name: "Closed", value: stats.closedRequests || 0 },
    { name: "Declined", value: stats.declinedRequests || 0 },
  ];

  const technicianData = [
    { name: "Technicians", value: stats.technicianCount || 0, fill: "#3b82f6" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="bg-white p-6 rounded-xl shadow border lg:col-span-2">
        <h3 className="font-semibold mb-4 text-gray-700">
          Department Requests Overview
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={requestData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border flex flex-col justify-center">
        <h3 className="text-gray-600 text-sm mb-2">Technicians in Dept</h3>

        <div className="text-4xl font-bold text-blue-600">
          {stats.technicianCount || 0}
        </div>

        <p className="text-gray-500 text-sm mt-1">people</p>
      </div>

      {stats.maxDeptCapacity && (
        <div className="bg-white p-6 rounded-xl shadow border lg:col-span-3">
          <h3 className="font-semibold mb-4 text-gray-700">
            Department Capacity
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={technicianData}
                dataKey="value"
                outerRadius={110}
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
