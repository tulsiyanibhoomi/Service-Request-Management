type Props = {
  message?: string;
};

export default function CustomError({ message = "Failed to load" }: Props) {
  return (
    <div className="flex items-center justify-center py-20 bg-gray-50">
      <p className="text-red-500 text-xl font-semibold">{message}</p>
    </div>
  );
}
