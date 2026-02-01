"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestDetails from "@/app/components/ui/requestdetails";
import { ServiceRequest } from "@/app/types/requests";

export default function HODRequestDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<"Employee" | "HOD" | "Admin">("Employee");

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                fetch(`/api/hod/requests/${id}`)
                    .then(res => res.json())
                    .then(data => setData(data));

                fetch("/api/auth/current-user")
                    .then(res => res.json())
                    .then(data => setRole(data.user.role));

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

    return <RequestDetails
        data={data}
        backLink="/hod/requests"
        role={role}
    />;
}