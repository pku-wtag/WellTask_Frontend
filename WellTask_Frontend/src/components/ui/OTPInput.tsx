interface OTPInputProps {
  length?: number;
}

export function OTPInput({ length = 6 }: OTPInputProps) {
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      ))}
    </div>
  );
}
