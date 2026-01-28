'use client'

import { ROUTES } from "@/app/config/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })

            const data = await response.json()

            if (data.success) {
                const role = data.user.role.toLowerCase()
                const roleKey = role.toLowerCase() as keyof typeof ROUTES.DASHBOARD_ROUTES
                const redirectUrl = ROUTES.DASHBOARD_ROUTES[roleKey] || "/dashboard"
                router.push(redirectUrl)
                console.log("Sign in successful, redirecting to", redirectUrl)
            } else {
                setError(data.error || "Sign in failed")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Welcome Back
            </h2>
            <p className="text-gray-600 mb-6 text-center">Login to your account</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="********"
                            className="flex-1 px-4 py-2 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="px-3 border-l border-gray-300 text-gray-500 flex items-center justify-center"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 mt-5 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-6 text-gray-600 text-center">
                Don't have an account?{" "}
                <Link href={ROUTES.SIGNUP} className="text-blue-600 hover:underline">
                    Sign Up
                </Link>
            </p>
        </>
    );
}