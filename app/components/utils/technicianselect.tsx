import { useState } from "react";

export function TechnicianSelect({
    technicians,
    value,
    onChange,
}: {
    technicians: any[];
    value: number | null;
    onChange: (id: number) => void;
}) {
    const [open, setOpen] = useState(false);

    const selected = technicians.find(t => t.id === value);

    const capitalize = (str: string) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase()).replace("_", " ");

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full border rounded-lg px-3 py-2 text-left flex justify-between items-center"
            >
                <span>{selected ? selected.name : "Select technician"}</span>
                <span className="text-gray-400">▾</span>
            </button>

            {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {technicians.map((tech) => (
                        <button
                            key={tech.id}
                            disabled={!tech.selectable}
                            onClick={() => {
                                onChange(tech.id);
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-2 flex justify-between items-center text-sm
                                ${tech.selectable ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}
                            `}
                        >
                            <span>{tech.name}</span>

                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full
                                    ${tech.status === "available" && "bg-green-500 text-white"}
                                    ${tech.status === "busy" && "bg-yellow-500 text-white"}
                                    ${tech.status === "on_leave" && "bg-red-500 text-white"}
                                `}
                            >
                                {capitalize(tech.status)}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}