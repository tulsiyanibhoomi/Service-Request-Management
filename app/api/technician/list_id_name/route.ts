import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const technicianRole = await prisma.role.findUnique({
            where: {
                rolename: "Technician",
            },
            select: {
                roleid: true,
            },
        });

        if (!technicianRole) {
            return NextResponse.json([], { status: 404 });
        }

        const technicianUsers = await prisma.user_role.findMany({
            where: {
                roleid: technicianRole.roleid,
            },
            select: {
                userid: true,
                users: {
                    select: {
                        fullname: true,
                    },
                },
            },
        });

        const data = technicianUsers.map(tu => ({
            userid: tu.userid,
            name: tu.users.fullname,
        }));

        return NextResponse.json(data);
    } catch (err) {
        console.error("Technicians List API error:", err);
        return NextResponse.json([], { status: 500 });
    }
}