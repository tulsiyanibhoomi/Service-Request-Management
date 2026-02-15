"use client";

import { useState } from "react";
import { ServiceRequest } from "@/app/types/requests";
import { cancelServiceRequest } from "@/app/actions/requests/cancelRequest";

interface EmployeeCancelModalProps {
  request: ServiceRequest;
  onClose: () => void;
}

export default function EmployeeCancelModal({
  request,
  onClose,
}: EmployeeCancelModalProps) {
  const [reason, setReason] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCancelRequest = async () => {
    if (!reason.trim()) {
      setFormError("Please provide a reason for canceling the request");
      return;
    }

    try {
      setLoading(true);
      setFormError(null);

      await cancelServiceRequest({
        requestId: request.service_request_id,
        reason,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Cancel Request</h2>

        <div className="mb-4">
          <textarea
            rows={4}
            className="w-full border rounded-lg p-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a reason for cancelling this request..."
            required
          />
        </div>

        {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            onClick={handleCancelRequest}
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Cancel Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
