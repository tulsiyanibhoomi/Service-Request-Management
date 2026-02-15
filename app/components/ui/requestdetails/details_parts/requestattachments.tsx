import { ServiceRequest } from "@/app/types/requests";
import { useState } from "react";
import LightboxModal from "./attachmentsmodal";

interface RequestAttachmentsProps {
  data: ServiceRequest;
}

export default function RequestAttachments({ data }: RequestAttachmentsProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Attachments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.attachments?.map((file, index) => (
            <img
              key={index}
              src={file}
              alt={`Attachment ${index + 1}`}
              className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && data.attachments && (
        <LightboxModal
          files={data.attachments}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}
    </>
  );
}
