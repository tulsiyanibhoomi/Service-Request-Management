interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}
export default function TextInput({
  label,
  value,
  onChange,
  type = "text",
  error,
}: TextInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
