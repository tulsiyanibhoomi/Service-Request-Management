import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

export default function InfoCard({ icon, title, value }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-lg transition flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2 text-gray-700">
        {icon} <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
