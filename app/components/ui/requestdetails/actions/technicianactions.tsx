import { ServiceRequest } from "@/app/types/requests";
import { TechnicianAction } from "@/app/types/role_actions";

interface TechnicianActionsProps {
  data: ServiceRequest;
  onAction: (action: TechnicianAction) => void;
}

export default function TechnicianActions({
  data,
  onAction,
}: TechnicianActionsProps) {
  const isRequested = data.reassignment_requested;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Update Status
      </h2>

      <div className="flex flex-col gap-4">
        {data.status === "Approved" && (
          <>
            <button
              className="px-5 py-2 rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRequested}
              onClick={() => onAction("Start")}
            >
              Start Work
            </button>

            <button
              className={`px-5 py-2 rounded-lg text-white transition ${
                isRequested
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={() => onAction(isRequested ? "Withdraw" : "Reassign")}
            >
              {isRequested
                ? "Withdraw Reassignment Request"
                : "Request Reassignment"}
            </button>

            {isRequested && (
              <p className="text-sm text-yellow-600">
                Reassignment requested - awaiting HOD decision
              </p>
            )}
          </>
        )}

        {data.status === "In Progress" && (
          <>
            <button
              className="px-5 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRequested}
              onClick={() => onAction("Complete")}
            >
              Complete Work
            </button>

            <button
              className={`px-5 py-2 rounded-lg text-white transition ${
                isRequested
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={() => onAction(isRequested ? "Withdraw" : "Reassign")}
            >
              {isRequested
                ? "Withdraw Reassignment Request"
                : "Request Reassignment"}
            </button>

            {isRequested && (
              <p className="text-sm text-yellow-600">
                Reassignment requested - awaiting HOD decision
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
