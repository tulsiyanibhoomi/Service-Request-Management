"use client";

import deleteRequestStatus from '@/app/actions/request-status/deleteStatus';
import Table from '@/app/components/ui/table';
import { useEffect, useState } from 'react';

type RequestStatus = {
    service_request_status_id: number;
    service_request_status_name: number;
    system_name: string;
    description: string;
    is_allowed_for_technician: boolean;
    username: string;
};

export default function Requests() {

    const [status, setStatus] = useState<RequestStatus[]>([]);

    useEffect(() => {
        fetch("/api/request-status/list")
            .then(res => res.json())
            .then(data => {
                setStatus(data);
            });
    }, []);

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Request Status</h1>
            <Table
                data={status}
                rowKey="service_request_status_id"
                columns={['service_request_status_id', 'status_name', 'description'
                ]}
                onDelete={deleteRequestStatus}
            />
        </div>
    );
}