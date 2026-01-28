"use client"

import deleteDepartment from '@/app/actions/departments/deleteDepartment';
import Table from '@/app/components/ui/table';
import { useEffect, useState } from 'react';

type Department = {
    service_dept_id: number;
    service_dept_name: string;
    description: string;
    cc_email_to_csv: string;
    userid: number;
    created: string;
    modified: string;
    username: string;
};

export default function Departments() {

    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        fetch("/api/departments/list")
            .then(res => res.json())
            .then(data => {
                setDepartments(data);
            });
    }, []);

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Departments</h1>
            <Table
                data={departments}
                onDelete={deleteDepartment}
                rowKey='service_dept_id'
            />
        </div>
    );
}