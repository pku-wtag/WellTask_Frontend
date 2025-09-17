import classNames from "classnames";

interface OTPInputProps {
  length?: number;
}

export function OTPInput({ length = 6 }: OTPInputProps) {
  const inputClass = classNames(
    "w-12 h-12 text-center text-lg font-semibold border rounded-lg outline-none",
    "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  );

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, idx) => (
        <input key={idx} type="text" maxLength={1} className={inputClass} />
      ))}
    </div>
  );
}
