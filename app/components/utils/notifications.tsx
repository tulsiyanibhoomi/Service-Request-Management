"use client";
import { useEffect, useState, useRef } from "react";
import { formatDate } from "./styles";

interface Notification {
  id: number;
  message: string;
  timestamp?: string;
  link?: string;
}

interface NotificationsDropdownProps {
  apiUrl: string;
}

export default function NotificationsDropdown({
  apiUrl,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(apiUrl, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        const list = data.notifications || [];
        setNotifications(
          list.map((n: Notification, i: number) => ({ ...n, unread: i < 3 })),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [apiUrl]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative px-4 py-2 rounded-lg bg-white hover:bg-gray-100 hover:shadow-lg transition flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        Notifications
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-auto z-50 animate-slideDown">
          <div className="p-4 font-semibold border-b text-gray-800 text-lg">
            Notifications ({notifications.length})
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm text-center">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-4 hover:bg-gray-50 transition cursor-pointer flex justify-between items-start bg-blue-50`}
                  onClick={() =>
                    n.link ? (window.location.href = n.link) : null
                  }
                >
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">
                      {n.message}
                    </span>
                    {n.timestamp && (
                      <span className="text-gray-400 text-xs mt-1">
                        {formatDate(n.timestamp)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
