import { useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

type Department = { id: number; name: string };

interface HodDeptSelectProps {
  departments: Department[];
  selectedDeptId?: number;
  onChange: (deptId: number) => void;
}

export default function HodDeptSelect({
  departments,
  selectedDeptId,
  onChange,
}: HodDeptSelectProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | "add_new" | undefined>(
    selectedDeptId,
  );

  useEffect(() => {
    setSelected(selectedDeptId);
  }, [selectedDeptId]);

  const handleSelect = (value: number | "add_new") => {
    if (value === "add_new") {
      router.push("/admin/dept/add");
      return;
    }
    setSelected(value);
    onChange(value);
  };

  return (
    <div className="w-full relative">
      <Listbox value={selected} onChange={handleSelect}>
        <ListboxButton className="w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          {selected && selected !== "add_new"
            ? departments.find((d) => d.id === selected)?.name
            : "Select Department"}
        </ListboxButton>

        <ListboxOptions className="w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto sm:text-sm focus:outline-none z-10 transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0">
          {departments.map((dept) => (
            <ListboxOption
              key={dept.id}
              value={dept.id}
              className={({ active }) =>
                `cursor-pointer select-none relative py-2 px-4 ${
                  active ? "bg-blue-100 text-blue-700" : "text-gray-900"
                }`
              }
            >
              {dept.name}
            </ListboxOption>
          ))}

          <ListboxOption
            value="add_new"
            className={({ active }) =>
              `cursor-pointer select-none relative py-2 px-4 font-bold ${
                active ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"
              }`
            }
          >
            + ADD NEW DEPARTMENT
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
