"use client";

import { useState } from "react";
import { startServiceRequest } from "@/app/actions/requests/startRequest";
import { completeServiceRequest } from "@/app/actions/requests/completeRequest";
import { requestReassignment } from "@/app/actions/requests/requestReassign";
import { TechnicianAction } from "@/app/types/role_actions";
import { withdrawRequestReassign } from "@/app/actions/requests/withdrawRequestReassign";

interface TechnicianWorkModalProps {
  requestId: number;
  technicianId: number;
  currentStatus: "Approved" | "In Progress" | "Completed" | "Closed";
  action: TechnicianAction;
  onClose: () => void;
}

export default function TechnicianDecisionModal({
  requestId,
  technicianId,
  action,
  onClose,
}: TechnicianWorkModalProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (action === "Reassign" && !comment.trim()) {
      setError("Reason is required for reassignment");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (action === "Start")
        await startServiceRequest({ requestId, technicianId, comment });
      if (action === "Complete")
        await completeServiceRequest({ requestId, technicianId, comment });
      if (action === "Reassign")
        await requestReassignment({ requestId, technicianId, reason: comment });
      if (action === "Withdraw")
        await withdrawRequestReassign({ requestId, technicianId });

      onClose();
    } catch {
      setError("Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    Start: "Start Work",
    Complete: "Complete Work",
    Reassign: "Request Reassignment",
    Withdraw: "Withdraw Reassignment",
  };

  const buttonMap = {
    Start: {
      label: "Start Work",
      className: "bg-yellow-600 hover:bg-yellow-700",
    },
    Complete: {
      label: "Complete Work",
      className: "bg-green-600 hover:bg-green-700",
    },
    Reassign: {
      label: "Send Request",
      className: "bg-indigo-600 hover:bg-indigo-700",
    },
    Withdraw: {
      label: "Withdraw Reassignment Request",
      className: "bg-red-600 hover:bg-red-700",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">{titleMap[action]}</h2>

        <textarea
          className="w-full border rounded-lg p-3"
          rows={4}
          placeholder={
            action === "Reassign"
              ? "Explain why this request should be reassigned..."
              : "Work notes (optional)"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex gap-4 mt-6">
          <button
            className={`text-white px-5 py-2 rounded-lg ${buttonMap[action].className} 
            disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : buttonMap[action].label}
          </button>

          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
