"use client";

import { useEffect, useState } from "react";
import { ServiceRequest } from "@/app/types/requests";
import { formatDate } from "../../table";
import { approveServiceRequest } from "@/app/actions/requests/approveRequest";
import { closeServiceRequest } from "@/app/actions/requests/closeRequest";
import { declineServiceRequest } from "@/app/actions/requests/declineRequest";
import { TechnicianSelect } from "../../technicianselect";

interface DecisionModalProps {
  request: ServiceRequest;
  action: "Approve" | "Decline" | "Close" | "Reassign";
  onClose: () => void;
}

interface Technician {
  id: number;
  name: string;
  status: "available" | "busy" | "on_leave";
  selectable: boolean;
}

type ActionHandler = (payload: any) => Promise<void>;

const actionMap: Record<
  DecisionModalProps["action"],
  ActionHandler | undefined
> = {
  Approve: approveServiceRequest,
  Reassign: approveServiceRequest,
  Decline: declineServiceRequest,
  Close: closeServiceRequest,
};

export default function HODDecisionModal({
  request,
  action,
  onClose,
}: DecisionModalProps) {
  const [comment, setComment] = useState<string>("");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [technicianId, setTechnicianId] = useState<number | null>();
  const [loadingTechs, setLoadingTechs] = useState(false);
  const [techError, setTechError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const isReassign = action === "Reassign";
  const isApprove = action === "Approve";

  const showTechnicianSelect = isApprove || isReassign;

  const fetchTechnicians = async () => {
    try {
      setLoadingTechs(true);
      setTechError(null);

      const res = await fetch("/api/technician/list_id_name");
      if (!res.ok) throw new Error("Failed to load technicians");

      const data = await res.json();

      setTechnicians(data);
    } catch (err) {
      setTechError("Unable to load technicians");
    } finally {
      setLoadingTechs(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/current-user");

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      setUserId(data.user.id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    if (!showTechnicianSelect) return;
    fetchTechnicians();
  }, [showTechnicianSelect]);

  const handleAction = async () => {
    if (showTechnicianSelect && !technicianId) {
      setFormError("Please select a technician");
      return;
    }

    if (!userId) {
      setFormError("User not loaded");
      return;
    }

    const serverAction = actionMap[action];
    if (!serverAction) {
      setFormError("Server action not implemented");
      return;
    }

    if ((action === "Close" || action === "Decline") && !comment.trim()) {
      setFormError("Comment is required");
      return;
    }

    const payload: Record<string, any> = {
      requestId: request.service_request_id,
      hodId: userId,
      comment,
    };

    if (showTechnicianSelect) {
      payload.technicianId = technicianId;
    }

    try {
      await serverAction(payload);
      onClose();
    } catch (err) {
      console.error(err);

      if (!(err instanceof Error && err.message.includes("Redirect"))) {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  const availableTechnicians = isReassign
    ? technicians.filter((tech) => tech.id !== request.assigned_to_userid)
    : technicians;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div
        className="relative z-10 w-full p-6 bg-white rounded-2xl shadow-xl"
        style={{ width: "45rem" }}
      >
        <h2 className="text-2xl font-semibold mb-4 capitalize">
          {action} Request
        </h2>

        <div className="border rounded-lg p-4 mb-4 bg-gray-50 space-y-2">
          <p>
            <strong>Title:</strong> {request.title}
          </p>
          <p>
            <strong>Submitted By:</strong> {request.userfullname}
          </p>
          <p>
            <strong>Priority:</strong> {request.priority}
          </p>
          <p>
            <strong>Requested On:</strong> {formatDate(request.submitted_at)}
          </p>
          {action === "Reassign" && (
            <div className="mb-4">
              <p>
                <strong>Currently Assigned To:</strong>{" "}
                {request.assigned_to || "N/A"}
              </p>
            </div>
          )}
        </div>

        {showTechnicianSelect && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              {isReassign ? "Reassign Technician" : "Assign Technician"}
            </label>

            {loadingTechs && (
              <p className="text-sm text-gray-500">Loading technicians…</p>
            )}

            {techError && <p className="text-sm text-red-600">{techError}</p>}

            <TechnicianSelect
              technicians={availableTechnicians}
              value={technicianId ?? null}
              onChange={(id) => {
                setTechnicianId(id);
                setFormError(null);
              }}
            />
          </div>
        )}

        <div className="mb-2">
          Comment{" "}
          {action === "Close" || action === "Decline" ? "" : "(optional)"}
          <textarea
            className="w-full border rounded-lg p-2"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
        </div>

        {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-white transition ${
              action === "Approve"
                ? "bg-green-600 hover:bg-green-700"
                : action === "Reassign"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : action === "Close"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={handleAction}
          >
            {action} Request
          </button>
        </div>
      </div>
    </div>
  );
}
