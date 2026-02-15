import { ServiceRequest } from "@/app/types/requests";

interface TechnicianActionsProps {
  data: ServiceRequest;
  onAction: (action: "Start" | "Complete" | "Reassign") => void;
}

export default function TechnicianActions({
  data,
  onAction,
}: TechnicianActionsProps) {
  if (data.status === "Completed" || data.status === "Closed") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Update Status
        </h2>
        <p className="text-sm text-gray-500">Work is already finished.</p>
      </div>
    );
  }

  const isDisabled = data.reassign_requested;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Update Status
      </h2>
      <div className="flex flex-col gap-4">
        {data.status === "Approved" && (
          <>
            <button
              className={`px-5 py-2 rounded-lg text-white transition ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
              disabled={isDisabled}
              onClick={() => onAction("Start")}
            >
              Start Work
            </button>

            <button
              className={`px-5 py-2 rounded-lg text-white transition ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={isDisabled}
              onClick={() => onAction("Reassign")}
            >
              Request Reassignment
            </button>

            {isDisabled && (
              <p className="text-sm text-yellow-600">
                Reassignment requested - awaiting HOD decision
              </p>
            )}
          </>
        )}

        {data.status === "In Progress" && (
          <>
            <button
              className={`px-5 py-2 rounded-lg text-white transition ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isDisabled}
              onClick={() => onAction("Complete")}
            >
              Complete Work
            </button>

            <button
              className={`px-5 py-2 rounded-lg text-white transition ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={isDisabled}
              onClick={() => onAction("Reassign")}
            >
              Request Reassignment
            </button>

            {isDisabled && (
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
