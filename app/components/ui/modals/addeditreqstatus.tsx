"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

interface AddEditServiceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { statusName: string; description: string }) => void;
  initialData?: {
    statusName: string;
    description: string;
  };
}

export default function AddEditServiceStatusModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddEditServiceStatusModalProps) {
  const [statusName, setStatusName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<{ statusName?: string }>({});

  useEffect(() => {
    if (initialData) {
      setStatusName(initialData.statusName || "");
      setDescription(initialData.description || "");
    } else {
      setStatusName("");
      setDescription("");
    }
    setError({});
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    const newError: { statusName?: string } = {};
    if (!statusName.trim()) {
      newError.statusName = "Status name is required";
      setError(newError);
      return;
    }

    onSubmit({
      statusName: statusName.trim(),
      description: description.trim(),
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
                  {initialData ? "Edit Status" : "Add Status"}
                </DialogTitle>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Name*
                    </label>
                    <input
                      type="text"
                      value={statusName}
                      onChange={(e) => {
                        setStatusName(e.target.value);
                        if (error.statusName)
                          setError((prev) => ({
                            ...prev,
                            statusName: undefined,
                          }));
                      }}
                      placeholder="Enter status name"
                      className={`w-full rounded-lg border px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        error.statusName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {error.statusName && (
                      <p className="mt-1 text-red-600 text-sm">
                        {error.statusName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description || ""}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                    />
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
                    {initialData ? "Save Changes" : "Add Status"}
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
