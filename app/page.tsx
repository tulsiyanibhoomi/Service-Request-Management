import Link from "next/link";
import { ROUTES } from "@/app/config/routes";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-600">ReqEase</h1>
          <nav className="space-x-6">
            <Link
              href={ROUTES.LOGIN}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-6 pb-8 pt-24">
        <div className="md:w-1/2 text-center md:text-left md:pl-10 md:pr-3 pb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Service Request Management
          </h2>
          <div className="text-gray-600 text-lg md:text-xl mb-1">
            ReqEase helps you track, manage, and resolve service requests efficiently,
            whether you're a small team or a large organization.
          </div>
          <div className="text-gray-600 text-lg md:text-xl mb-16">
            Create requests quickly, assign them to team members, and monitor progress in real time.
          </div>

          <div className="flex justify-center md:justify-start gap-4">
            <Link
              href={ROUTES.LOGIN}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mb-12 md:mb-0 flex justify-center">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/images/hero_section.png"
              alt="Service request illustration"
              className="w-full relative z-10 block"
            />
            {/* Feathered edges */}
            <div
              className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
              style={{
                boxShadow: "inset 0 0 40px 20px rgba(249,250,251,0.9)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 pb-24 pt-16">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-14">
            Why Choose ReqEase?
          </h3>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-blue-600 mb-4 text-4xl">📋</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">
                Track Requests
              </h4>
              <p className="text-gray-600">
                Keep all requests organized and accessible in one place.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-blue-600 mb-4 text-4xl">🤝</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">
                Assign Tasks
              </h4>
              <p className="text-gray-600">
                Delegate work efficiently and monitor progress in real time.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-blue-600 mb-4 text-4xl">🔔</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">
                Notifications
              </h4>
              <p className="text-gray-600">
                Stay updated when requests change status or need attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-24">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to streamline your workflow?
          </h3>
          <Link
            href={ROUTES.SIGNUP}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 py-6">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} ReqEase. All rights reserved.
        </div>
      </footer>
    </main>
  );
}