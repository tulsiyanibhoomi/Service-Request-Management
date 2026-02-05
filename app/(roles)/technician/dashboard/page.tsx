"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import { Overview, RecentRequest } from "@/app/types/dashboard";

export default function TechnicianDashboardPage() {
    const [overview, setOverview] = useState<Overview>({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        approved: 0,
    });

    const [requests, setRequests] = useState<RecentRequest[]>([]);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        fetch("/api/technician/overview")
            .then(res => res.json())
            .then(setOverview);

        fetch("/api/technician/assigned-requests")
            .then(res => res.json())
            .then(setRequests);

        fetch("/api/auth/current-user")
            .then(res => res.json())
            .then(data => setUserName(data.user.fullname || "Technician"));
    }, []);

    return (
        <CommonDashboard<RecentRequest>
            title={<div className="flex w-full items-center">Hello, {userName}</div>}
            tableTitle="Assigned Requests"
            overview={overview}
            tableData={requests}
            tableColumns={["no", "title", "type", "priority"]}
            tableRowKey="service_request_id"
        // tableRowActions={[
        //     {
        //         name: "Actions",
        //         render: (row: any) => {
        //             const status = row.status.toLowerCase();
        //             return (
        //                 <div className="flex gap-2">
        //                     {status === "approved" && (
        //                         <button
        //                             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        //                             onClick={e => {
        //                                 e.stopPropagation();
        //                             }}
        //                         >
        //                             Start Work
        //                         </button>
        //                     )}
        //                     {status === "in progress" && (
        //                         <>
        //                             <button
        //                                 className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        //                                 onClick={e => {
        //                                     e.stopPropagation();
        //                                     // mark as completed
        //                                 }}
        //                             >
        //                                 Complete
        //                             </button>
        //                             <button
        //                                 className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
        //                                 onClick={e => {
        //                                     e.stopPropagation();
        //                                     // request reassignment
        //                                 }}
        //                             >
        //                                 Reassign
        //                             </button>
        //                         </>
        //                     )}
        //                 </div>
        //             );
        //         },
        //     },
        // ]}
        />
    );
}