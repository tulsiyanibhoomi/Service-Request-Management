import { ServiceRequest } from "@/app/types/requests";
import {
  priorityGradient,
  statusGradient,
} from "@/app/components/utils/styles";

interface RequestStatusProps {
  data: ServiceRequest;
}

export default function RequestStatus({ data }: RequestStatusProps) {
  const showUpdateInfo = data.status !== "Pending";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Status & Priority
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-500">Status</span>
          <span
            className={`px-3 py-1 rounded-full font-semibold text-sm ${statusGradient(data.status)}`}
          >
            {data.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-500">Priority</span>
          <span
            className={`px-3 py-1 rounded-full font-semibold text-sm ${priorityGradient(data.priority!)}`}
          >
            {data.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
