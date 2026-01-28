"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestDetails from "@/app/components/ui/requestdetails";
import { ServiceRequest } from "@/app/types/requests";

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

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!data) return <p className="text-center mt-10">Request not found</p>;

    return <RequestDetails data={data} backLink="/admin/requests" />;
}
