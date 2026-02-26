import Link from "next/link";
import { ROUTES } from "@/app/config/routes";

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create Account
      </h2>
      <p className="text-gray-600 mb-6 text-center">Sign up to get started</p>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 mt-5 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-gray-600 text-center">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
