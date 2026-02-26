"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/layout/sidebar";
import { usePathname, useRouter } from "next/navigation";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";
import { notify } from "../utils/notify";

interface CurrentUser {
  id: string;
  email: string;
  fullname: string;
  username: string;
  role: "admin" | "employee" | "hod";
}

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`${url} failed with status ${res.status}`);
    return res.json();
  }

  const pathname = usePathname();

  useEffect(() => {
    const messageMatch = document.cookie.match(/flashMessage=([^;]+)/);
    const typeMatch = document.cookie.match(/flashType=([^;]+)/);

    if (messageMatch) {
      const message = decodeURIComponent(messageMatch[1]);
      const type = typeMatch ? typeMatch[1] : "success";

      if (type === "error") {
        notify.error(message);
      } else if (type === "info") {
        notify.info(message);
      } else if (type === "warning") {
        notify.warning(message);
      } else {
        notify.success(message);
      }
      document.cookie = "flashMessage=; max-age=0; path=/";
      document.cookie = "flashType=; max-age=0; path=/";
    }
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchJson<{ user: CurrentUser | null }>(
          "/api/auth/current-user",
        );

        if (!data.user) {
          router.replace("/auth/login");
          return;
        }

        setUser(data.user);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <SkeletonCard />;
  if (error) return <CustomError message="Authentication failed" />;
  if (!user) return <CustomError message="User not available" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center justify-between px-6 border-b z-20">
        <div className="flex items-center w-32 border-r border-gray-300 pr-4">
          <div className="text-lg font-semibold text-gray-800">{user.role}</div>
        </div>

        <div className="text-lg font-semibold text-gray-800">
          Service Request Management System
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-1 rounded hover:bg-gray-100 transition">
            Notifications
          </button>
          <div className="font-medium text-gray-700">{user.fullname}</div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="fixed top-14 left-0 h-[calc(100vh-56px)] w-64 bg-white shadow-md flex flex-col">
          <Sidebar role={user.role} />
        </aside>

        <main className="ml-64 mt-14 flex-1 p-6 overflow-auto h-[calc(100vh-56px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
