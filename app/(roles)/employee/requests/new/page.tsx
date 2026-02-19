"use client";

import React, { useState } from "react";
import addRequest from "@/app/actions/requests/addRequest";
import editRequest from "@/app/actions/requests/editRequest";
import { useRequestFormData } from "./use-form-data";
import FileUploader from "./file-upload";
import SkeletonCard from "@/app/components/ui/skeletoncard";
import CustomError from "@/app/components/ui/error";

const NewRequest = () => {
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { formData, setFormData, requestTypes, loading, error, requestId } =
    useRequestFormData();

  if (loading) return <SkeletonCard />;

  if (error || !formData)
    return (
      <CustomError message="Failed to fetch form data. Please try again." />
    );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.serviceRequestTitle?.trim())
      errors.serviceRequestTitle = "Title is required";
    if (!formData.serviceRequestDescription?.trim())
      errors.serviceRequestDescription = "Description is required";
    if (!formData.serviceRequestTypeId)
      errors.serviceRequestTypeId = "Please select request type";
    if (!formData.urgency) errors.urgency = "Please select urgency";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPublicId = (url: string) => {
    const parts = url.split("/");
    const fileName = parts.slice(-2).join("/");
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

    if (!validate()) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (removedFiles.length > 0) {
        const publicIds = removedFiles.map(getPublicId);
        const delRes = await fetch("/api/delete-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_ids: publicIds }),
        });
        if (!delRes.ok) throw new Error("Failed to delete removed files");
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

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {requestId ? "Edit Service Request" : "Raise a Service Request"}
      </h2>

      {submitError && <CustomError message={submitError} />}
      {submitSuccess && (
        <p className="text-green-600 text-center mb-4">
          Request submitted successfully!
        </p>
      )}

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
            error={fieldErrors.serviceRequestTitle}
          />
          <TextArea
            label="Description"
            name="serviceRequestDescription"
            value={formData.serviceRequestDescription}
            onChange={handleChange}
            error={fieldErrors.serviceRequestDescription}
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
            error={fieldErrors.serviceRequestTypeId}
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
            error={fieldErrors.urgency}
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
            disabled={submitLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequest;

const Input = ({ label, error, ...props }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className={`border p-3 rounded-lg focus:ring-2 focus:outline-none ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-400"
      } bg-gray-100`}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const TextArea = ({ label, error, ...props }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <textarea
      {...props}
      rows={6}
      className={`border p-3 rounded-lg focus:ring-2 focus:outline-none ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-400"
      }`}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const Select = ({ label, options, error, ...props }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <select
      {...props}
      className={`border p-3 rounded-lg focus:ring-2 focus:outline-none ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-400"
      }`}
    >
      <option value="">Select</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);
