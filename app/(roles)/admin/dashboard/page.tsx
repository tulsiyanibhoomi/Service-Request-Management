"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import { Overview, RecentRequest } from "@/app/types/dashboard";

export default function AdminDashboardPage() {
    const [overview, setOverview] = useState<Overview>({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
    });

    const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        fetch("/api/admin/overview")
            .then(res => res.json())
            .then(setOverview);

        fetch("/api/admin/recent_request")
            .then(res => res.json())
            .then(setRecentRequests);

        fetch("/api/auth/current-user")
            .then(res => res.json())
            .then(data => setUserName(data.user.fullname || "User"));
    }, []);

    return (
        <CommonDashboard<RecentRequest>
            title={
                <div className="flex w-full items-center">
                    <span>Hello, {userName}</span>
                </div>
            }
            overview={overview}
            tableData={recentRequests}
            tableColumns={["no", "title", "type", "priority", "status"]}
            tableRowKey="service_request_id"
        />

    );
}