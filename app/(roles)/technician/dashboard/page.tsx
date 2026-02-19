"use client";

import { useEffect, useState } from "react";
import CommonDashboard from "@/app/components/ui/dashboard";
import { Overview, RecentRequest } from "@/app/types/dashboard";
import { User } from "@/app/types/user";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";

export default function TechnicianDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [requests, setRequests] = useState<RecentRequest[]>([]);
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
        const [overviewData, requests, userData] = await Promise.all([
          fetchJson<Overview>("/api/technician/overview"),
          fetchJson<RecentRequest[]>("/api/technician/assigned-requests"),
          fetchJson<{ user: User | null }>("/api/auth/current-user"),
        ]);

        setOverview(overviewData);
        setRequests(requests);
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
  if (!overview || !requests || !user)
    return <CustomError message="Data not available" />;

  return (
    <CommonDashboard<RecentRequest>
      user={user}
      title={<span>Hello, {user.fullname}</span>}
      tableTitle="Assigned Requests"
      overview={overview}
      tableData={requests}
      tableColumns={["no", "title", "type", "priority"]}
      tableRowKey="service_request_id"
    />
  );
}
