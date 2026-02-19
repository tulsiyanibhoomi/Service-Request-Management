export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatValue(value: any) {
  if (value === undefined || value === null) return "-";
  return String(value);
}

export const statusGradient = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-400";
    case "in progress":
      return "bg-blue-100 text-blue-800 border-blue-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-400";
    case "closed":
      return "bg-gray-200 text-gray-700 border-gray-400";
    case "cancelled":
      return "bg-rose-100 text-rose-800 border border-rose-400";
    case "approved":
      return "bg-purple-100 text-purple-800 border-purple-400";
    case "declined":
      return "bg-red-100 text-red-800 border-red-400";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-400";
  }
};

export const priorityGradient = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-green-200 text-green-800";
    case "medium":
      return "bg-yellow-200 text-yellow-800";
    case "high":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};
