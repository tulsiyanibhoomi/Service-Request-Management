"use client";

import { useEffect, useState } from "react";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";

export type UserStats = {
  projects?: number;
  tasks?: number;
  teams?: number;
};

export type User = {
  fullname: string;
  username: string;
  role: string;
  email?: string;
  phone?: string;
  avatar?: string;
  about?: string;
};

export default function UserProfile({ userId }: { userId?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultAvatar = "https://i.pravatar.cc/150?img=3";

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = "/api/auth/current-user";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        if (!data.user) throw new Error("No user data found");

        setUser({
          fullname: data.user.fullname || data.user.username,
          username: data.user.username,
          role: data.user.role,
          email: data.user.email,
          phone: data.user.phone,
          avatar: data.user.avatar,
          about: data.user.about,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <SkeletonCard />; // consistent loading
  if (error) return <CustomError message={error} />; // consistent error handling

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">
          <img
            src={user?.avatar || defaultAvatar}
            alt={user?.fullname}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.fullname}
              </h1>
              <p className="text-gray-500 mt-1">{user?.role}</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="font-semibold">Email</p>
              <p>{user?.email || "Not provided"}</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p>{user?.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {user?.about && (
        <div className="mt-8 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
          <p className="text-gray-600">{user.about}</p>
        </div>
      )}
    </div>
  );
}
