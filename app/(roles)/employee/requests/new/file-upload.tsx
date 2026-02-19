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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let files = Array.from(e.target.files);

    const invalidFiles = files.filter((f) => f.size > 10 * 1024 * 1024); // >10MB
    if (invalidFiles.length > 0) {
      alert("Some files exceed 10MB and will not be added.");
      files = files.filter((f) => f.size <= 10 * 1024 * 1024);
    }

    if (files.length > 0) onAddNew(files);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors duration-200"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          onAddNew(files);
        }}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <p className="text-gray-500 text-sm text-center">
          Drag & drop files here, or click to select
        </p>
        <p className="text-gray-400 text-xs mt-1">Supports multiple files</p>
      </div>

      <input
        type="file"
        id="fileInput"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {existingFiles.length > 0 && (
        <ul className="mt-2 space-y-1">
          {existingFiles.map((url, idx) => (
            <li
              key={`existing-${idx}`}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              <span className="truncate">{url.split("/").pop()}</span>
              <button
                type="button"
                onClick={() => onRemoveExisting(idx)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {newFiles.length > 0 && (
        <ul className="mt-2 space-y-1">
          {newFiles.map((file, idx) => (
            <li
              key={`new-${idx}`}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveNew(idx)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
