import { ServiceRequest } from "@/app/types/requests";

interface HODAdminActionsProps {
  data: ServiceRequest;
  onAction: (action: "Approve" | "Decline" | "Close" | "Reassign") => void;
}

export default function HODAdminActions({
  data,
  onAction,
}: HODAdminActionsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Actions</h2>

      <div className="flex flex-col gap-4">
        {data.status === "Pending" && (
          <>
            <button
              className="w-full bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => onAction("Approve")}
            >
              Approve
            </button>
            <button
              className="w-full bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => onAction("Decline")}
            >
              Decline
            </button>
          </>
        )}

        {data.status !== "Pending" && (
          <>
            {data.reassignment_requested && (
              <button
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                onClick={() => onAction("Reassign")}
              >
                Review Reassignment Request
              </button>
            )}
            <button
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => onAction("Close")}
            >
              Close Request
            </button>
          </>
        )}
      </div>
    </div>
  );
}
