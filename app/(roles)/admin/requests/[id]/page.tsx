"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestDetails from "@/app/components/ui/requestdetails/requestdetails";
import { ServiceRequest } from "@/app/types/requests";
import SkeletonCard from "@/app/components/utils/skeletoncard";
import CustomError from "@/app/components/utils/error";

export default function AdminRequestDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/requests/${id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <SkeletonCard />;
  if (!data) return <CustomError message="Could not fetch request details" />;

  return (
    <RequestDetails data={data} backLink="/admin/requests" role={"Admin"} />
  );
}
