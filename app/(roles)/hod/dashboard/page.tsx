"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import { Overview, RecentRequest } from "@/app/types/dashboard";

export default function HodDashboardPage() {
  const [overview, setOverview] = useState<Overview>({
    total: 0,
    pending: 0,
    approved: 0,
    in_progress: 0,
    completed: 0,
  });

  const [requests, setRequests] = useState<RecentRequest[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetch("/api/hod/overview")
      .then((res) => res.json())
      .then(setOverview);

    fetch("/api/hod/pending-requests")
      .then((res) => res.json())
      .then(setRequests);

    fetch("/api/auth/current-user")
      .then((res) => res.json())
      .then((data) => setUserName(data.user.fullname || "User"));
  }, []);

  return (
    <CommonDashboard<RecentRequest>
      title={
        <div className="flex w-full items-center">
          <span>Hello, {userName}</span>
        </div>
      }
      overview={overview}
      tableData={requests}
      tableColumns={["no", "title", "type", "priority", "date"]}
      tableRowKey="service_request_id"
      // tableRowActions={[
      //     {
      //         name: "Actions",
      //         render: (row: any) => (
      //             <div className="flex gap-2">
      //                 <button
      //                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      //                     onClick={e => {
      //                         e.stopPropagation();
      //                     }}
      //                 >
      //                     Accept
      //                 </button>
      //                 <button
      //                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
      //                     onClick={e => {
      //                         e.stopPropagation();
      //                     }}
      //                 >
      //                     Decline
      //                 </button>
      //             </div>
      //         ),
      //     },
      // ]}
    />
  );
}
