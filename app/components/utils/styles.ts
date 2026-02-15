export const statusGradient = (status: string) => {
  switch (status.toLowerCase()) {
    case "Open":
      return "bg-green-400 text-white";
    case "In Progress":
      return "bg-yellow-400 text-white";
    case "Pending":
      return "bg-orange-400 text-white";
    case "Closed":
      return "bg-gray-400 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    case "approved":
      return "bg-teal-500 text-white";
    case "declined":
      return "bg-red-600 text-white";
    default:
      return "bg-blue-400 text-white";
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
