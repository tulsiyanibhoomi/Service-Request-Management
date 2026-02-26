export const Input = ({ label, error, ...props }: any) => (
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

export const TextArea = ({ label, error, ...props }: any) => (
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

export const Select = ({ label, options, error, ...props }: any) => (
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
