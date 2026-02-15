import { ServiceRequest } from "@/app/types/requests";
import { formatDate } from "@/app/components/ui/table";

interface RequestTimeStampsProps {
  data: ServiceRequest;
}

export default function RequestTimeStamps({ data }: RequestTimeStampsProps) {
  const timeline = data.status_history.map((h) => ({
    label: h.status === "Pending" ? "Submitted At" : h.status + " At",
    date: h.changed_at,
    by: h.changed_by?.fullname ?? null,
    notes: h.notes ?? null,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Timestamps</h2>

      {/* {timestamps.map(
        (ts) =>
          ts.value && (
            <div
              key={ts.label}
              className="relative pl-6 pb-6 border-l border-gray-200 last:border-l-0"
            >
              <span className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow" />

              <div>
                <p className="font-semibold text-gray-800">{ts.label}</p>
                <p className="text-sm text-gray-500">{formatDate(ts.value)}</p>

                {ts.by && (
                  <p className="text-xs text-gray-400 mt-1">By {ts.by}</p>
                )}
              </div>
            </div>
          ),
      )} */}

      {timeline.map(
        (item, index) =>
          item.date && (
            <div
              key={`${item.label}-${index}`}
              className="relative pl-6 pb-6 border-l border-gray-200 last:border-l-0"
            >
              <span className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow" />

              <div>
                <p className="font-semibold text-gray-800">{item.label}</p>

                <p className="text-sm text-gray-500">{formatDate(item.date)}</p>

                {item.by && (
                  <p className="text-xs text-gray-400 mt-1">By {item.by}</p>
                )}

                {item.notes && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
