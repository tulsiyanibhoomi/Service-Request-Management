"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import { Overview, RecentRequest } from "@/app/types/dashboard";
import Link from "next/link";
import { ROUTES } from "@/app/config/routes";

export default function EmployeeDashboardPage() {
  const [overview, setOverview] = useState<Overview>({
    total: 0,
    pending: 0,
    approved: 0,
    in_progress: 0,
    completed: 0,
  });

  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetch("/api/employee/overview")
      .then((res) => res.json())
      .then(setOverview);

    fetch("/api/employee/recent-requests")
      .then((res) => res.json())
      .then(setRecentRequests);

    fetch("/api/auth/current-user")
      .then((res) => res.json())
      .then((data) => setUserName(data.user.fullname || "User"));
  }, []);

  return (
    <CommonDashboard<RecentRequest>
      title={
        <div className="flex w-full items-center">
          <span>Hello, {userName}</span>
          <div className="flex-1 flex justify-end">
            <Link
              href={ROUTES.RAISEREQUEST}
              className="px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition text-lg"
              style={{ fontWeight: "normal" }}
            >
              Raise a request
            </Link>
          </div>
        </div>
      }
      overview={overview}
      tableData={recentRequests}
      tableColumns={["no", "title", "type", "priority", "status"]}
      tableRowKey="service_request_id"
    />
  );
}
