"use client";

import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { notify } from "../utils/notify";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const match = document.cookie.match(/flashMessage=([^;]+)/);
    if (match) {
      notify.info(decodeURIComponent(match[1]));
      document.cookie = "flashMessage=; max-age=0";
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-sky-200 overflow-hidden px-4">
      <div className="absolute w-[30rem] h-[30rem] bg-indigo-300 rounded-full blur-3xl opacity-35 -top-40 -left-40 animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute w-[30rem] h-[30rem] bg-sky-300 rounded-full blur-3xl opacity-35 bottom-[-10rem] right-[-10rem]" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-8">
        {children}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}
