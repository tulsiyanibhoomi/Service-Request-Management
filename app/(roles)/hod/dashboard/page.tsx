// "use client";

// import Table from "@/app/components/ui/table";
// import { useEffect, useState } from "react";

// type HodOverview = {
//     total: number;
//     pending: number;
//     in_progress: number;
//     completed: number;
// };

// type Request = {
//     service_request_id: number;
//     title: string;
//     type: string;
//     priority: string;
//     service_request_datetime: string;
// };

// // type Technician = {
// //     userid: number;
// //     name: string;
// // };

// function HodHome() {
//     const [overview, setOverview] = useState<HodOverview>({
//         pending: 0,
//         in_progress: 0,
//         total: 0,
//         completed: 0,
//     });

//     const [requests, setRequests] = useState<Request[]>([]);
//     // const [technicians, setTechnicians] = useState<Technician[]>([]);
//     const [selectedTech, setSelectedTech] = useState<Record<number, number>>({});

//     useEffect(() => {
//         fetch("/api/hod/overview").then(res => res.json()).then(setOverview);
//         fetch("/api/hod/pending-requests").then(res => res.json()).then(setRequests);
//         // fetch("/api/technician/list_id_name").then(res => res.json()).then(setTechnicians);
//     }, []);

//     const acceptRequest = async (row: any) => {
//         const id = row.service_request_id;
//         const technicianId = selectedTech[id];
//         if (!technicianId) {
//             alert("Please select a technician");
//             return;
//         }
//         await fetch(`/api/hod/requests/${id}/accept`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ technicianId }),
//         });
//         setRequests(prev => prev.filter(r => r.service_request_id !== id));
//     };

//     const declineRequest = async (row: any) => {
//         const id = row.service_request_id;
//         await fetch(`/api/hod/requests/${id}/reject`, { method: "POST" });
//         setRequests(prev => prev.filter(r => r.service_request_id !== id));
//     };

//     // const handleSelectTechnician = (requestId: number, techId: string) => {
//     //     setSelectedTech((prev) => ({
//     //         ...prev,
//     //         [requestId]: Number(techId),
//     //     }));
//     // };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-bold mb-6">HOD Dashboard</h1>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                 {[
//                     { title: "Total Requests", value: overview.total, color: "bg-yellow-100 text-yellow-800" },
//                     { title: "Pending", value: overview.pending, color: "bg-blue-100 text-blue-800" },
//                     { title: "Assigned", value: overview.in_progress, color: "bg-red-100 text-red-800" },
//                     { title: "Completed", value: overview.completed, color: "bg-green-100 text-green-800" },
//                 ].map(card => (
//                     <div key={card.title} className={`${card.color} p-5 rounded-xl shadow`}>
//                         <p className="font-medium">{card.title}</p>
//                         <p className="text-2xl font-bold mt-2">{card.value}</p>
//                     </div>
//                 ))}
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow">
//                 <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>

//                 <Table
//                     data={requests}
//                     columns={['no', 'title', 'type', 'priority', 'status']}
//                     rowKey="service_request_id"
//                     showEditDelete={false}
//                     rowActions={[
//                         // {
//                         //     name: "Technician",
//                         //     render: (row) => (
//                         //         <select
//                         //             className="border rounded px-2 py-1 w-full md:w-auto"
//                         //             value={selectedTech[row.service_request_id] || ""}
//                         //             onChange={(e) => handleSelectTechnician(row.service_request_id, e.target.value)}
//                         //         >
//                         //             <option value="">Assign Technician</option>
//                         //             {technicians.map((t) => (
//                         //                 <option key={t.userid} value={t.userid}>
//                         //                     {t.name}
//                         //                 </option>
//                         //             ))}
//                         //         </select>

//                         //     )
//                         // },
//                         {
//                             name: "Actions",
//                             render: (row) => (
//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={(e) => { e.stopPropagation(); acceptRequest(row); }}
//                                         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
//                                     >
//                                         Accept
//                                     </button>
//                                     <button
//                                         onClick={(e) => { e.stopPropagation(); declineRequest(row); }}
//                                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                                     >
//                                         Decline
//                                     </button>
//                                 </div>
//                             )
//                         }
//                     ]}
//                 />
//             </div>
//         </div>
//     );
// }

// export default HodHome;



"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import { Overview, RecentRequest } from "@/app/types/dashboard";

export default function HodDashboardPage() {
    const [overview, setOverview] = useState<Overview>({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
    });

    const [requests, setRequests] = useState<RecentRequest[]>([]);
    const [selectedTech, setSelectedTech] = useState<Record<number, number>>({});
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        fetch("/api/hod/overview")
            .then(res => res.json())
            .then(setOverview);

        fetch("/api/hod/pending-requests")
            .then(res => res.json())
            .then(setRequests);

        fetch("/api/auth/current-user")
            .then(res => res.json())
            .then(data => setUserName(data.user.fullname || "User"));
    }, []);

    const acceptRequest = async (row: RecentRequest) => {
        const id = row.service_request_id;
        const technicianId = selectedTech[id];
        if (!technicianId) {
            alert("Please select a technician");
            return;
        }
        await fetch(`/api/hod/requests/${id}/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ technicianId }),
        });
        setRequests(prev => prev.filter(r => r.service_request_id !== id));
    };

    const declineRequest = async (row: RecentRequest) => {
        const id = row.service_request_id;
        await fetch(`/api/hod/requests/${id}/reject`, { method: "POST" });
        setRequests(prev => prev.filter(r => r.service_request_id !== id));
    };

    return (
        <CommonDashboard<RecentRequest>
            title={
                <div className="flex w-full items-center">
                    <span>Hello, {userName}</span>
                </div>
            }
            overview={overview}
            tableData={requests}
            tableColumns={["no", "title", "type", "priority", "status"]}
            tableRowKey="service_request_id"
            tableRowActions={[
                {
                    name: "Actions",
                    render: (row: any) => (
                        <div className="flex gap-2">
                            <button
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                onClick={e => {
                                    e.stopPropagation();
                                    acceptRequest(row);
                                }}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                onClick={e => {
                                    e.stopPropagation();
                                    declineRequest(row);
                                }}
                            >
                                Decline
                            </button>
                        </div>
                    ),
                },
            ]}
        />
    );
}