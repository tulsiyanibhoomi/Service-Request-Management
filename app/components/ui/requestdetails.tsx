"use client";

import { useState } from "react";
import Link from "next/link";
import LightboxModal from "@/app/components/ui/attachmentsmodal";
import { ServiceRequest } from "@/app/types/requests";
import { formatDate } from "@/app/components/ui/table";
import DecisionModal from "./requestdecisionmodal";

interface RequestDetailsProps {
    data: ServiceRequest;
    backLink?: string;
    role?: "Employee" | "HOD" | "Admin" | "Technician";
}

export default function RequestDetails({ data, backLink = "/requests", role }: RequestDetailsProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const canDecide = role === "HOD" || role === "Admin";
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<"Approve" | "Decline" | "Close" | "Reassign">("Approve");
    const canPostDecision = canDecide && data.status !== "Pending";

    const statusGradient = (status: string) => {
        switch (status.toLowerCase()) {
            case "Open": return "bg-green-400 text-white";
            case "In Progress": return "bg-yellow-400 text-white";
            case "Pending": return "bg-orange-400 text-white";
            case "Closed": return "bg-gray-400 text-white";
            default: return "bg-blue-400 text-white";
        }
    };

    const priorityGradient = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "low": return "bg-green-200 text-green-800";
            case "medium": return "bg-yellow-200 text-yellow-800";
            case "high": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };

    const handleApprove = async () => {
        setModalAction("Approve");
        setModalOpen(true);
    };

    const handleDecline = async () => {
        setModalAction("Decline");
        setModalOpen(true);
    };

    const handleClose = async () => {
        setModalAction("Close");
        setModalOpen(true);
    };

    const handleReassign = async () => {
        setModalAction("Reassign");
        setModalOpen(true);
    };

    const handleStatusUpdate = async (status: string) => {
        // setModalAction(status as "In Progress" | "Completed"); // Type adjustment
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-bold">Request #{data.no}</h1>
                <Link
                    href={backLink}
                    className="bg-white text-indigo-800 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
                >
                    ← Back
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Request Information</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>Title:</strong> {data.title}</p>
                            <p><strong>Description:</strong> <span className="whitespace-pre-line">{data.description}</span></p>
                            <p><strong>Service Type:</strong> {data.type}</p>
                            <p><strong>Department:</strong> {data.department}</p>
                            <p><strong>Submitted By:</strong> {data.userfullname}</p>
                            <p><strong>Submitted On:</strong> {formatDate(data.created_at)}</p>
                            <p><strong>Requested Date:</strong> {formatDate(data.datetime)}</p>
                        </div>
                    </div>

                    {data.attachments && data.attachments.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Attachments</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {data.attachments.map((file, index) => (
                                    <img
                                        key={index}
                                        src={file}
                                        alt={`Attachment ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                                        onClick={() => setLightboxIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {lightboxIndex !== null && data.attachments && (
                        <LightboxModal
                            files={data.attachments}
                            currentIndex={lightboxIndex}
                            onClose={() => setLightboxIndex(null)}
                            onNavigate={(newIndex) => setLightboxIndex(newIndex)}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Status & Priority</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">Status</span>
                                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${statusGradient(data.status)}`}>
                                    {data.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">Updated By</span>
                                <span>{data.status_update_by_user}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">Update Time</span>
                                <span>{formatDate(data.status_update_datetime)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">Priority</span>
                                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${priorityGradient(data.priority!)}`}>
                                    {data.priority}
                                </span>
                            </div>
                        </div>
                    </div>

                    {canDecide && data.status === "Pending" && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Decision</h2>
                            <div className="flex gap-4">
                                <button
                                    className="bg-green-600 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                                    onClick={handleApprove}
                                >
                                    Approve
                                </button>

                                <button
                                    className="bg-red-600 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                                    onClick={handleDecline}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    )}

                    {canPostDecision && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Actions</h2>
                            {data.status === "Closed" ? (
                                <p className="text-sm text-gray-500">This request is already closed.</p>
                            ) : data.status === "Declined" ? (
                                <p className="text-sm text-gray-500">This request has been declined.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <button
                                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                                        onClick={handleDecline}
                                    >
                                        Decline Request
                                    </button>

                                    <button
                                        className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
                                        onClick={handleClose}
                                    >
                                        Close Request
                                    </button>

                                    <button
                                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                                        onClick={handleReassign}
                                    >
                                        Reassign Request
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {role === "Technician" && data.status !== "Closed" && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Status</h2>
                            <div className="flex gap-4">
                                <button
                                    className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 transition"
                                    onClick={() => handleStatusUpdate("In Progress")}
                                >
                                    Mark In Progress
                                </button>
                                <button
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                                    onClick={() => handleStatusUpdate("Completed")}
                                >
                                    Mark Completed
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Assignment</h2>
                        <div className="border-l-2 border-indigo-400 pl-4 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Assigned To</p>
                                <p className="font-medium text-gray-800">{data.assigned_to_fullname || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Assigned By</p>
                                <p className="font-medium text-gray-800">{data.assigned_by || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Assigned On</p>
                                <p className="font-medium text-gray-800">{data.assigned_datetime ? new Date(data.assigned_datetime).toLocaleString() : "N/A"}</p>
                            </div>
                            {data.assigned_description && (
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="text-gray-700 whitespace-pre-line">{data.assigned_description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Timestamps</h2>
                        <p><strong>Created At:</strong> {formatDate(data.created_at)}</p>
                        <p><strong>Modified At:</strong> {formatDate(data.modified_at)}</p>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <DecisionModal
                    request={data}
                    action={modalAction}
                    onClose={() => setModalOpen(false)}
                />
            )}

        </div>
    );
}