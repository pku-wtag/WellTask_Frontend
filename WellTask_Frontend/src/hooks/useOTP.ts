import { useRef, useCallback } from "react";
import { useForm } from "react-final-form";

interface UseOTPProps {
  length: number;
  namePrefix: string;
}

export function useOTP({ length, namePrefix }: UseOTPProps) {
  const form = useForm();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = e.target;
      if (value) {
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    },
    [length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
        if (!e.currentTarget.value) {
          if (index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        }
      }
    },
    []
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, length);

      pastedData.split("").forEach((char, index) => {
        form.change(`${namePrefix}-${index}`, char);
      });

      const focusIndex = Math.min(pastedData.length, length - 1);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex]?.focus();
      }
    },
    [length, namePrefix, form]
  );

  return {
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
  };
}
