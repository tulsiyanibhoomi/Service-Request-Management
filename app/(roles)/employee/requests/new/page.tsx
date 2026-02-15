"use client";
import React, { useState } from "react";
import addRequest from "@/app/actions/requests/addRequest";
import editRequest from "@/app/actions/requests/editRequest";
import { useRequestFormData } from "./use-form-data";
import FileUploader from "./file-upload";

const NewRequest = () => {
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  const { formData, setFormData, requestTypes, loading, requestId } =
    useRequestFormData();

  if (loading || !formData) return <p>Loading...</p>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const getPublicId = (url: string) => {
    const parts = url.split("/");
    const fileName = parts.slice(-2).join("/");
    console.log(fileName.replace(/\.[^/.]+$/, ""));
    return fileName.replace(/\.[^/.]+$/, "");
  };

  const handleRemoveExisting = (idx: number) => {
    const fileUrl = formData.existingFiles[idx];
    setRemovedFiles((prev) => [...prev, fileUrl]);
    setFormData((prev: any) => ({
      ...prev,
      existingFiles: prev.existingFiles.filter((_: any, i: any) => i !== idx),
    }));
  };

  const handleRemoveNew = (idx: number) =>
    setFormData((prev: any) => ({
      ...prev,
      newFiles: prev.newFiles.filter((_: any, i: number) => i !== idx),
    }));

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_requests");
    formData.append("folder", "requests");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (removedFiles.length > 0) {
      const publicIds = removedFiles.map(getPublicId);
      await fetch("/api/delete-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_ids: publicIds }),
      });
    }

    const uploadedUrls = await Promise.all(
      formData.newFiles.map((file: File) => uploadToCloudinary(file)),
    );

    const allFiles = [...formData.existingFiles, ...uploadedUrls];

    const data = new FormData();
    data.append("serviceRequestNo", formData.serviceRequestNo);
    data.append("serviceRequestTitle", formData.serviceRequestTitle);
    data.append(
      "serviceRequestDescription",
      formData.serviceRequestDescription,
    );
    data.append("serviceRequestTypeId", formData.serviceRequestTypeId);
    data.append("urgency", formData.urgency);
    data.append("serviceRequestDateTime", formData.serviceRequestDateTime);
    data.append("employee_id", String(formData.employee_id));
    data.append("existingFiles", JSON.stringify(allFiles));

    if (requestId) {
      await editRequest(Number(requestId), data);
    } else {
      await addRequest(data);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {requestId ? "Edit Service Request" : "Raise a Service Request"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <Input
            label="Service Request Number"
            value={formData.serviceRequestNo}
            readOnly
          />
          <Input
            label="Request Title"
            name="serviceRequestTitle"
            value={formData.serviceRequestTitle}
            onChange={handleChange}
            required
          />
          <TextArea
            label="Description"
            name="serviceRequestDescription"
            value={formData.serviceRequestDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-4">
          <Select
            label="Request Type"
            name="serviceRequestTypeId"
            value={formData.serviceRequestTypeId}
            onChange={handleChange}
            options={requestTypes.map((t: any) => ({
              value: t.type_id,
              label: t.type,
            }))}
            required
          />
          <Select
            label="Urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            options={[
              { value: "Low", label: "Low - Can wait" },
              { value: "Medium", label: "Medium - Affects work" },
              { value: "High", label: "High - Work stopped" },
            ]}
            required
          />
          <FileUploader
            existingFiles={formData.existingFiles}
            newFiles={formData.newFiles}
            onAddNew={(files: any) =>
              setFormData((prev: any) => ({
                ...prev,
                newFiles: [...prev.newFiles, ...files],
              }))
            }
            onRemoveExisting={handleRemoveExisting}
            onRemoveNew={handleRemoveNew}
          />
          <Input
            label="Preferred date and time (Optional)"
            type="datetime-local"
            name="serviceRequestDateTime"
            value={formData.serviceRequestDateTime}
            onChange={handleChange}
          />
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

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100"
    />
  </div>
);

const TextArea = ({ label, ...props }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <textarea
      {...props}
      rows={6}
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <select
      {...props}
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      <option value="">Select</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
