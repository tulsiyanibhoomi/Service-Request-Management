import { ServiceRequest } from "@/app/types/requests";
import { formatDate } from "@/app/components/ui/table";

interface RequestInfoProps {
  data: ServiceRequest;
}

export default function RequestInfo({ data }: RequestInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Request Information
      </h2>
      <div className="space-y-4 text-gray-700">
        <p>
          <strong>Title:</strong> {data.title}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          <span className="whitespace-pre-line">{data.description}</span>
        </p>
        <p>
          <strong>Service Type:</strong> {data.type}
        </p>
        <p>
          <strong>Department:</strong> {data.department}
        </p>
        <p>
          <strong>Submitted By:</strong> {data.userfullname}
        </p>
        <p>
          <strong>Requested Date:</strong> {formatDate(data.datetime)}
        </p>
      </div>
    </div>
  );
}
