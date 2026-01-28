"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LightboxModalProps {
    files: string[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}

export default function LightboxModal({ files, currentIndex, onClose, onNavigate }: LightboxModalProps) {
    const router = useRouter();

    if (!files || files.length === 0) return null;

    const goPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prev = currentIndex > 0 ? currentIndex - 1 : files.length - 1;
        onNavigate(prev);
    };

    const goNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = currentIndex < files.length - 1 ? currentIndex + 1 : 0;
        onNavigate(next);
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();

        const cloudinaryUrl = files[currentIndex];
        const downloadUrl = cloudinaryUrl.replace('/upload/', '/upload/fl_attachment/');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `image-${currentIndex + 1}`;
        link.click();
    };

    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(files[currentIndex]);

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col" onClick={onClose}
            >
                <div className="flex justify-end p-4 gap-4">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all text-lg cursor-pointer"
                    >
                        Download
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                    </button>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center text-white font-bold w-14 h-14 rounded-full px-4 text-4xl shadow-lg transition-all cursor-pointer"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-1 justify-center px-4">
                    <div className="flex items-center justify-center w-full max-w-6xl">
                        <div className="flex-none">
                            <button
                                className="text-white text-4xl p-5 hover:text-gray-300 transition-colors cursor-pointer"
                                onClick={goPrev}
                            >
                                ‹
                            </button>
                        </div>

                        <div className="flex-1 flex justify-center items-center px-4">
                            {isImage ? (
                                <img
                                    src={files[currentIndex]}
                                    alt="Preview"
                                    className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
                                />
                            ) : (
                                <iframe
                                    src={files[currentIndex]}
                                    className="w-full h-[80vh] rounded bg-white shadow-2xl"
                                />
                            )}
                        </div>

                        <div className="flex-none">
                            <button
                                className="text-white text-4xl p-5 hover:text-gray-300 transition-colors cursor-pointer"
                                onClick={goNext}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}