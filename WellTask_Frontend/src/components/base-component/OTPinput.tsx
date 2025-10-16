import { Input } from "../fields/Input";
import { useOTP } from "../../hooks/useOTP";

interface OTPInputProps {
  length?: number;
  namePrefix?: string;
}

export function OTPInput({ length = 6, namePrefix = "otp" }: OTPInputProps) {
  const { inputRefs, handleChange, handleKeyDown, handlePaste } = useOTP({
    length,
    namePrefix,
  });

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, idx) => (
        <Input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          id={`${namePrefix}-${idx}`}
          name={`${namePrefix}-${idx}`}
          inputType="text"
          placeholder=""
          fullWidth={false}
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
