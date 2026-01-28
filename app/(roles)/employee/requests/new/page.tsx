'use client';

import addRequest from '@/app/actions/requests/addRequest';
import { useState, useEffect } from 'react';

interface User {
    username: string;
    initials: string;
}

type EmployeeOverview = {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
};

const NewRequest = () => {
    const [formData, setFormData] = useState({
        serviceRequestNo: '',
        serviceRequestDateTime: '',
        serviceRequestTypeId: '',
        serviceRequestTitle: '',
        serviceRequestDescription: '',
        urgency: '',
        attachmentPaths: [] as File[],
    });

    useEffect(() => {
        async function fetchFormData() {
            const res = await fetch('/api/current-user');
            const user: User = await res.json();

            const overviewRes = await fetch("/api/employee/overview");
            const overviewData: EmployeeOverview = await overviewRes.json();

            const requestNumber = overviewData.total + 1;
            const serviceRequestNo = `${user.initials.toUpperCase()}-${String(requestNumber).padStart(4, '0')}`;

            fetch("/api/request-types/type-names")
                .then((res) => res.json())
                .then((data) => setRequestTypes(data))
                .catch((err) => console.error(err));

            setFormData(prev => ({
                ...prev,
                serviceRequestNo,
            }));
        }
        fetchFormData();
    }, []);

    const [requestTypes, setRequestTypes] = useState([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("serviceRequestNo", formData.serviceRequestNo);
        data.append("serviceRequestTitle", formData.serviceRequestTitle);
        data.append("serviceRequestDescription", formData.serviceRequestDescription);
        data.append("serviceRequestTypeId", formData.serviceRequestTypeId);
        data.append("urgency", formData.urgency);
        data.append("serviceRequestDateTime", formData.serviceRequestDateTime);

        formData.attachmentPaths.forEach((file) => data.append("attachmentPaths", file));

        await addRequest(data);

    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setFormData(prev => ({
            ...prev,
            attachmentPaths: [...prev.attachmentPaths, ...Array.from(files)],
        }));
    };

    const handleRemoveFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachmentPaths: prev.attachmentPaths.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Raise a Service Request
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="serviceRequestNo" className="font-semibold text-gray-700">
                            Service Request Number
                        </label>
                        <input
                            type="text"
                            id="serviceRequestNo"
                            name="serviceRequestNo"
                            value={formData.serviceRequestNo}
                            readOnly
                            className="border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none"
                            placeholder="Service Request Number"
                        />

                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="serviceRequestTitle" className="font-semibold text-gray-700">
                            Request Title
                        </label>
                        <input
                            type="text"
                            id="serviceRequestTitle"
                            name="serviceRequestTitle"
                            value={formData.serviceRequestTitle}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter request title"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="serviceRequestDescription" className="font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="serviceRequestDescription"
                            name="serviceRequestDescription"
                            value={formData.serviceRequestDescription}
                            onChange={handleChange}
                            rows={6}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Describe the issue in detail"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label
                            htmlFor="serviceRequestTypeId"
                            className="font-semibold text-gray-700"
                        >
                            Request Type
                        </label>

                        <select
                            id="serviceRequestTypeId"
                            name="serviceRequestTypeId"
                            value={formData.serviceRequestTypeId}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        >
                            <option value="">Select a Type</option>

                            {requestTypes.map((t: any) => (
                                <option key={t.type_id} value={t.type_id}>
                                    {t.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="urgency" className="font-semibold text-gray-700">
                            Urgency
                        </label>
                        <select
                            id="urgency"
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        >
                            <option value="">Select Urgency</option>
                            <option value="Low">Low - Can wait</option>
                            <option value="Medium">Medium - Affects work</option>
                            <option value="High">High - Work stopped</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="attachmentPaths" className="font-semibold text-gray-700 mb-2">
                            Attachments
                        </label>

                        {/* Drag & Drop area */}
                        <div
                            className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors duration-200"
                            onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
                            onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                                e.preventDefault();
                                const files = Array.from(e.dataTransfer.files);
                                handleFileChange({
                                    target: { files } as unknown as EventTarget & { files: FileList },
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                            onClick={() => document.getElementById("attachmentPaths")?.click()}
                        >
                            <p className="text-gray-500 text-sm text-center">
                                Drag & drop files here, or click to select
                            </p>
                            <p className="text-gray-400 text-xs mt-1">Supports multiple files</p>
                        </div>

                        <input
                            type="file"
                            id="attachmentPaths"
                            name="attachmentPaths"
                            multiple
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleFileChange(e);
                                e.target.value = "";
                            }}
                            className="hidden"
                        />

                        {formData.attachmentPaths.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {formData.attachmentPaths.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        <span className="truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors duration-200"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="serviceRequestDateTime" className="font-semibold text-gray-700">
                            Preferred date and time (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            id="serviceRequestDateTime"
                            name="serviceRequestDateTime"
                            value={formData.serviceRequestDateTime}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                    </div>
                </div>

                <div className="col-span-2 flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewRequest;