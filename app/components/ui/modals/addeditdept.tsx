// "use client";

// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Transition,
//   TransitionChild,
// } from "@headlessui/react";
// import { Fragment, useState, useEffect } from "react";

// interface AddEditDeptModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: {
//     deptName: string;
//     description: string;
//     cc_email_to_csv: string;
//   }) => void;
//   initialData?: {
//     deptName: string;
//     description: string;
//     cc_email_to_csv: string;
//   };
// }

// export default function AddEditDeptModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
// }: AddEditDeptModalProps) {
//   const [deptName, setDeptName] = useState("");
//   const [description, setDescription] = useState("");
//   const [ccEmail, setCcEmail] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (initialData) {
//       setDeptName(initialData.deptName);
//       setDescription(initialData.description);
//       setCcEmail(initialData.cc_email_to_csv);
//     } else {
//       setDeptName("");
//       setDescription("");
//       setCcEmail("");
//     }
//     setError("");
//   }, [initialData, isOpen]);

//   const handleSubmit = () => {
//     if (!deptName.trim()) {
//       setError("Department name is required");
//       return;
//     }

//     onSubmit({
//       deptName: deptName.trim(),
//       description: description.trim(),
//       cc_email_to_csv: ccEmail.trim(),
//     });

//     setError("");
//     onClose();
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <TransitionChild
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-50"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-50"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black opacity-50" />
//         </TransitionChild>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <TransitionChild
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <DialogTitle className="text-2xl font-semibold text-gray-900">
//                   {initialData ? "Edit Department" : "Add Department"}
//                 </DialogTitle>

//                 <div className="mt-6 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Department Name*
//                     </label>
//                     <input
//                       type="text"
//                       value={deptName}
//                       onChange={(e) => {
//                         setDeptName(e.target.value);
//                         if (error) setError("");
//                       }}
//                       placeholder="Enter department name"
//                       className={`w-full rounded-lg border px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                         error
//                           ? "border-red-500 focus:ring-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {error && (
//                       <p className="mt-1 text-red-600 text-sm">{error}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description
//                     </label>
//                     <textarea
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       placeholder="Description"
//                       rows={3}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       CC Email
//                     </label>
//                     <input
//                       type="text"
//                       value={ccEmail}
//                       onChange={(e) => setCcEmail(e.target.value)}
//                       placeholder="email@example.com"
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end gap-3">
//                   <button
//                     type="button"
//                     className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
//                     onClick={onClose}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition shadow"
//                     onClick={handleSubmit}
//                   >
//                     {initialData ? "Save Changes" : "Add Department"}
//                   </button>
//                 </div>
//               </DialogPanel>
//             </TransitionChild>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

interface AddEditDeptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    deptName: string;
    description: string;
    cc_email_to_csv: string;
  }) => void;
  initialData?: {
    deptName: string;
    description: string;
    cc_email_to_csv: string;
  };
}

export default function AddEditDeptModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddEditDeptModalProps) {
  const [deptName, setDeptName] = useState("");
  const [description, setDescription] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [error, setError] = useState<{ dept?: string; ccEmail?: string }>({});

  useEffect(() => {
    if (initialData) {
      setDeptName(initialData.deptName);
      setDescription(initialData.description);
      setCcEmail(initialData.cc_email_to_csv);
    } else {
      setDeptName("");
      setDescription("");
      setCcEmail("");
    }
    setError({});
  }, [initialData, isOpen]);

  const validateEmail = (email: string) => {
    if (!email) return true; // optional field
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    let valid = true;
    const newError: { dept?: string; ccEmail?: string } = {};

    if (!deptName.trim()) {
      newError.dept = "Department name is required";
      valid = false;
    }

    if (!validateEmail(ccEmail.trim())) {
      newError.ccEmail = "Invalid email format";
      valid = false;
    }

    setError(newError);
    if (!valid) return;

    onSubmit({
      deptName: deptName.trim(),
      description: description.trim(),
      cc_email_to_csv: ccEmail.trim(),
    });

    setError({});
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {initialData ? "Edit Department" : "Add Department"}
                </DialogTitle>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name*
                    </label>
                    <input
                      type="text"
                      value={deptName}
                      onChange={(e) => {
                        setDeptName(e.target.value);
                        if (error.dept)
                          setError((prev) => ({ ...prev, dept: undefined }));
                      }}
                      placeholder="Enter department name"
                      className={`w-full rounded-lg border px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        error.dept
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {error.dept && (
                      <p className="mt-1 text-red-600 text-sm">{error.dept}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CC Email
                    </label>
                    <input
                      type="text"
                      value={ccEmail}
                      onChange={(e) => {
                        setCcEmail(e.target.value);
                        if (error.ccEmail)
                          setError((prev) => ({ ...prev, ccEmail: undefined }));
                      }}
                      placeholder="email@example.com"
                      className={`w-full rounded-lg border px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        error.ccEmail
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {error.ccEmail && (
                      <p className="mt-1 text-red-600 text-sm">
                        {error.ccEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition shadow"
                    onClick={handleSubmit}
                  >
                    {initialData ? "Save Changes" : "Add Department"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
