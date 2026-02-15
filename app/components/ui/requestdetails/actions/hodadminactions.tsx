import { ServiceRequest } from "@/app/types/requests";

interface HODAdminActionsProps {
  data: ServiceRequest;
  onAction: (action: "Approve" | "Decline" | "Close" | "Reassign") => void;
}

export default function HODAdminActions({
  data,
  onAction,
}: HODAdminActionsProps) {
  if (data.status === "Closed") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Actions</h2>
        <p className="text-sm text-gray-500">This request is already closed.</p>
      </div>
    );
  }

  if (data.status === "Declined") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Actions</h2>
        <p className="text-sm text-gray-500">This request has been declined.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Actions</h2>
      <div className="flex flex-col gap-4">
        {data.status === "Pending" && (
          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => onAction("Approve")}
            >
              Approve
            </button>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => onAction("Decline")}
            >
              Decline
            </button>
          </div>
        )}

        {data.status !== "Pending" && (
          <>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => onAction("Decline")}
            >
              Decline Request
            </button>
            <button
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => onAction("Close")}
            >
              Close Request
            </button>
            <button
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
              onClick={() => onAction("Reassign")}
            >
              Reassign Request
            </button>
          </>
        )}
      </div>
    </div>
  );
}
