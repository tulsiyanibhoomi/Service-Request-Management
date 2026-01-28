"use client"

import Table from '@/app/components/ui/table';
import deleteUser from "@/app/actions/users/deleteUser";
import { useEffect, useState } from 'react';

type User = {
    userid: number;
    fullname: string;
    email: string;
    created: string;
    modified: string;
};

export default function Users() {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("/api/users/list")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <Table
                data={users}
                columns={["userid", "fullname", "email", "roles"]}
                onDelete={deleteUser}
                rowKey='userid'
            />
        </div>
    );
}