"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestDetails from "@/app/components/ui/requestdetails/requestdetails";
import { ServiceRequest } from "@/app/types/requests";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";

export default function EmployeeRequestDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/employee/requests/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Could not fetch request details" />;
  if (!data) return <CustomError message="Request not found" />;

  return (
    <RequestDetails data={data} backLink="/employee/requests" role="Employee" />
  );
}
