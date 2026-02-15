// "use client";

// import { useState } from "react";
// import { startServiceRequest } from "@/app/actions/requests/startRequest";
// import { completeServiceRequest } from "@/app/actions/requests/completeRequest";

// type TechnicianAction = "Start" | "Complete" | "Reassign";

// interface TechnicianWorkModalProps {
//   requestId: number;
//   technicianId: number;
//   currentStatus: "Approved" | "In Progress" | "Completed" | "Closed";
//   action: TechnicianAction;
//   onClose: () => void;
// }

// export default function TechnicianDecisionModal({
//   requestId,
//   technicianId,
//   currentStatus,
//   action,
//   onClose,
// }: TechnicianWorkModalProps) {
//   const [comment, setComment] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleAction = async () => {
//     try {
//       setLoading(true);
//       if (action === "Start") {
//         await startServiceRequest({ requestId, technicianId, comment });
//       } else if (action === "Complete") {
//         await completeServiceRequest({ requestId, technicianId, comment });
//       }
//       else if (action === "Reassign") {
//         // await requestReassign({
//         //   requestId,
//         //   technicianId,
//         //   reason: comment,
//         // });
//       }
//       onClose();
//     } catch (err) {
//       setError("Failed to update request");
//     } finally {
//       setLoading(false);
//     }
//   };

//    const titleMap = {
//     Start: "Start Work",
//     Complete: "Complete Work",
//     Reassign: "Request Reassignment",
//   };

//   const buttonMap = {
//     Start: {
//       label: "Start Work",
//       className: "bg-yellow-600 hover:bg-yellow-700",
//     },
//     Complete: {
//       label: "Complete Work",
//       className: "bg-green-600 hover:bg-green-700",
//     },
//     Reassign: {
//       label: "Send Request",
//       className: "bg-indigo-600 hover:bg-indigo-700",
//     },
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-md"
//         onClick={onClose}
//       ></div>

//       <div
//         className="relative z-10 w-full p-6 bg-white rounded-2xl shadow-xl"
//         style={{ width: "45rem" }}
//       >
//         <h2 className="text-2xl font-semibold mb-4">
//           {currentStatus === "Approved"
//             ? "Start Work"
//             : currentStatus === "In Progress"
//               ? "Complete Work"
//               : "Work Status"}
//         </h2>

//         <div className="space-y-4">
//           <textarea
//             className="w-full border rounded-lg p-2"
//             rows={3}
//             placeholder="Work notes (optional)"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />

//           {error && <p className="text-red-600 text-sm">{error}</p>}

//           <div className="flex gap-4 mt-2">
//             {currentStatus === "Approved" && (
//               <button
//                 className="bg-yellow-600 text-white px-5 py-2 rounded-lg"
//                 onClick={() => handleAction("Start")}
//                 disabled={loading}
//               >
//                 Start Work
//               </button>
//             )}

//             {currentStatus === "In Progress" && (
//               <button
//                 className="bg-green-600 text-white px-5 py-2 rounded-lg"
//                 onClick={() => handleAction("Complete")}
//                 disabled={loading}
//               >
//                 Complete Work
//               </button>
//             )}

//             {(currentStatus === "Completed" || currentStatus === "Closed") && (
//               <p className="text-sm text-gray-500">Work is already finished.</p>
//             )}

//             <button
//               className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { startServiceRequest } from "@/app/actions/requests/startRequest";
import { completeServiceRequest } from "@/app/actions/requests/completeRequest";
// import { requestReassign } from "@/app/actions/requests/requestReassign";

type TechnicianAction = "Start" | "Complete" | "Reassign";

interface TechnicianWorkModalProps {
  requestId: number;
  technicianId: number;
  currentStatus: "Approved" | "In Progress" | "Completed" | "Closed";
  action: TechnicianAction;
  onClose: () => void;
}

export default function TechnicianDecisionModal({
  requestId,
  technicianId,
  currentStatus,
  action,
  onClose,
}: TechnicianWorkModalProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (action === "Reassign" && !comment.trim()) {
      setError("Reason is required for reassignment");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (action === "Start") {
        await startServiceRequest({ requestId, technicianId, comment });
      }

      if (action === "Complete") {
        await completeServiceRequest({ requestId, technicianId, comment });
      }

      if (action === "Reassign") {
        // await requestReassign({
        //   requestId,
        //   technicianId,
        //   reason: comment,
        // });
      }

      onClose();
    } catch {
      setError("Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    Start: "Start Work",
    Complete: "Complete Work",
    Reassign: "Request Reassignment",
  };

  const buttonMap = {
    Start: {
      label: "Start Work",
      className: "bg-yellow-600 hover:bg-yellow-700",
    },
    Complete: {
      label: "Complete Work",
      className: "bg-green-600 hover:bg-green-700",
    },
    Reassign: {
      label: "Send Request",
      className: "bg-indigo-600 hover:bg-indigo-700",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">{titleMap[action]}</h2>

        <textarea
          className="w-full border rounded-lg p-3"
          rows={4}
          placeholder={
            action === "Reassign"
              ? "Explain why this request should be reassigned..."
              : "Work notes (optional)"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex gap-4 mt-6">
          <button
            className={`text-white px-5 py-2 rounded-lg ${buttonMap[action].className}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : buttonMap[action].label}
          </button>

          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
