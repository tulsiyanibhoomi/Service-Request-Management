import React from "react";

export default function EmployeeProfile() {
    const employee = {
        name: "John Doe",
        role: "Senior Developer",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        location: "San Francisco, CA",
        avatar: "https://i.pravatar.cc/150?img=3",
        stats: {
            projects: 12,
            tasks: 134,
            teams: 3,
        },
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                    <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                    />
                </div>

                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
                            <p className="text-gray-500 mt-1">{employee.role}</p>
                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                        <div>
                            <p className="font-semibold">Email</p>
                            <p>{employee.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Phone</p>
                            <p>{employee.phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Location</p>
                            <p>{employee.location}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex space-x-6">
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-800">{employee.stats.projects}</p>
                            <p className="text-gray-500 text-sm">Projects</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-800">{employee.stats.tasks}</p>
                            <p className="text-gray-500 text-sm">Tasks Completed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-800">{employee.stats.teams}</p>
                            <p className="text-gray-500 text-sm">Teams</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
                <p className="text-gray-600">
                    John Doe is a senior developer with 5 years of experience in building scalable web
                    applications. Skilled in React, Node.js, and cloud technologies. He is part of 3 teams
                    working on multiple high-impact projects.
                </p>
            </div>
        </div>
    );
};