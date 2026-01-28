"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName = "user",
}: ConfirmDeleteModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-50"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-50"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Delete {itemName}?
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete this {itemName}? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}