import { ServiceRequest } from "@/app/types/requests";
import { formatDate } from "@/app/components/ui/table";

interface RequestAssignmentProps {
  data: ServiceRequest;
}

export default function RequestAssignment({ data }: RequestAssignmentProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Assignment</h2>
      <div className="border-l-2 border-indigo-400 pl-4 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Assigned To</p>
          <p className="font-medium text-gray-800">
            {data.assigned_to_fullname || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Assigned By</p>
          <p className="font-medium text-gray-800">
            {data.assigned_by || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Assigned On</p>
          <p className="font-medium text-gray-800">
            {data.assigned_datetime
              ? formatDate(new Date(data.assigned_datetime))
              : "N/A"}
          </p>
        </div>
        {data.assigned_description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700 whitespace-pre-line">
              {data.assigned_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
