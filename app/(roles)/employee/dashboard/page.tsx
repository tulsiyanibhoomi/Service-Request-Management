"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { Overview, RecentRequest } from "@/app/types/dashboard";
import { User } from "@/app/types/user";

export default function EmployeeDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[] | null>(
    null,
  );
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${url} failed with status ${res.status}`);
    }
    return res.json();
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [overviewData, recentData, userData] = await Promise.all([
          fetchJson<Overview>("/api/employee/overview"),
          fetchJson<RecentRequest[]>("/api/employee/recent-requests"),
          fetchJson<{ user: User | null }>("/api/auth/current-user"),
        ]);

        setOverview(overviewData);
        setRecentRequests(recentData);
        setUser(userData.user ?? null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Could not fetch data" />;
  if (!overview || !recentRequests || !user)
    return <CustomError message="Data not available" />;

  return (
    <CommonDashboard<RecentRequest>
      user={user}
      title={<span>Hello, {user.fullname}</span>}
      overview={overview}
      tableData={recentRequests}
      tableColumns={["no", "title", "type", "priority", "status"]}
      tableRowKey="service_request_id"
    />
  );
}
