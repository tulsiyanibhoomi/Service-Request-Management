"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { menuItemsByRole, MenuItem } from "@/app/components/layout/sidebardata";

interface SidebarProps {
    role: string;
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (name: string) => {
        setOpenMenus((prev) =>
            prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
        );
    };

    const menuItems: MenuItem[] = menuItemsByRole[role] || [];

    return (
        <aside className="w-64 bg-white h-full flex flex-col">
            <nav className="flex-1 overflow-auto mt-4">
                {menuItems.map((item, idx) => (
                    <div key={item.name} className="flex flex-col">
                        {item.subItems ? (
                            <>
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className="flex justify-between items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 font-semibold rounded transition"
                                >
                                    <div className="flex items-center">
                                        {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
                                        {item.name}
                                    </div>
                                    {openMenus.includes(item.name) ? <FiChevronUp /> : <FiChevronDown />}
                                </button>

                                {openMenus.includes(item.name) && (
                                    <div className="ml-8 mt-1 flex flex-col border-l border-gray-200 pl-3">
                                        {item.subItems.map((sub, subIdx) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.path!}
                                                className={`px-2 py-1 rounded hover:bg-gray-200 transition border-b last:border-b-0 ${pathname === sub.path ? "bg-gray-200 font-bold" : "text-gray-600"}`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={item.path!}
                                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded transition border-b last:border-b-0 ${pathname === item.path ? "bg-gray-200 font-bold" : ""}`}
                            >
                                {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
                                {item.name}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            <div className="mt-auto p-4 text-xs text-gray-400 text-center">
                © 2026 Company
            </div>
        </aside>
    );
}