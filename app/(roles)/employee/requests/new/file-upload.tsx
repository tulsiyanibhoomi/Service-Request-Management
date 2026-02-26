"use client";
import React from "react";

interface FileUploaderProps {
  existingFiles: string[];
  newFiles: File[];
  onAddNew: (files: File[]) => void;
  onRemoveExisting: (index: number) => void;
  onRemoveNew: (index: number) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  existingFiles,
  newFiles,
  onAddNew,
  onRemoveExisting,
  onRemoveNew,
}) => {
  const MAX_FILES = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let files = Array.from(e.target.files);

    const totalFiles = existingFiles.length + newFiles.length;

    if (totalFiles >= MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const remainingSlots = MAX_FILES - totalFiles;
    files = files.slice(0, remainingSlots);

    const invalidFiles = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert("Some files exceed 10MB and will not be added.");
      files = files.filter((f) => f.size <= 10 * 1024 * 1024);
    }

    if (files.length > 0) onAddNew(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    let files = Array.from(e.dataTransfer.files);

    const totalFiles = existingFiles.length + newFiles.length;

    if (totalFiles >= MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const remainingSlots = MAX_FILES - totalFiles;
    files = files.slice(0, remainingSlots);

    const validFiles = files.filter((f) => f.size <= 10 * 1024 * 1024);

    if (validFiles.length < files.length) {
      alert("Some files exceed 10MB and will not be added.");
    }

    if (validFiles.length > 0) {
      onAddNew(validFiles);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        className={`border-2 border-dashed p-4 rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ${
          existingFiles.length + newFiles.length >= MAX_FILES
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 cursor-pointer hover:border-blue-400"
        }`}
        onDragOver={(e) =>
          existingFiles.length + newFiles.length < MAX_FILES &&
          e.preventDefault()
        }
        onDrop={(e) =>
          existingFiles.length + newFiles.length < MAX_FILES && handleDrop(e)
        }
        onClick={() =>
          existingFiles.length + newFiles.length < MAX_FILES &&
          document.getElementById("fileInput")?.click()
        }
      >
        <p className="text-gray-500 text-sm text-center">
          Drag & drop files here, or click to select
        </p>
        <p className="text-gray-400 text-xs mt-1">Supports multiple files</p>
      </div>

      <p
        className={`text-sm mt-1 ${
          existingFiles.length + newFiles.length >= MAX_FILES
            ? "text-red-500"
            : "text-gray-400"
        }`}
      >
        {existingFiles.length + newFiles.length >= MAX_FILES
          ? `Maximum ${MAX_FILES} files reached`
          : `${existingFiles.length + newFiles.length} / ${MAX_FILES} files uploaded`}
      </p>
      <input
        type="file"
        id="fileInput"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {existingFiles.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {existingFiles.map((url, idx) => (
            <li key={`existing-${idx}`} className="relative w-24 h-24">
              <img
                src={url}
                alt={`attachment-${idx}`}
                className="w-full h-full object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(idx)}
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-red-500 rounded-full hover:text-red-700 text-sm shadow-md"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}

      {newFiles.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {newFiles.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <li key={`new-${idx}`} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => onRemoveNew(idx)}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-red-500 rounded-full hover:text-red-700 text-sm shadow-md"
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
