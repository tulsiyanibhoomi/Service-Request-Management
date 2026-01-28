"use client"
import { useRouter } from "next/navigation"

export default function ForbiddenPage() {
    const router = useRouter()

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            const role = localStorage.getItem("userRole") || "employee"
            if (role === "Admin") router.push("/admin/dashboard")
            else if (role === "HOD") router.push("/hod/dashboard")
            else router.push("/employee/dashboard")
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-6xl font-bold text-red-500">403</h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                Access Denied
            </h2>
            <p className="mt-2 text-gray-600 max-w-md">
                You don’t have permission to access this page.
            </p>

            <button
                onClick={handleGoBack}
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
            >
                Go back
            </button>
        </div>
    )
}