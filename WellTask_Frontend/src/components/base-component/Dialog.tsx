import { useEffect } from "react";

interface DialogProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Dialog = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: DialogProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  let bgColor = "bg-blue-100 text-blue-800";
  if (type === "success") bgColor = "bg-green-100 text-green-800";
  if (type === "error") bgColor = "bg-red-100 text-red-800";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-md ${bgColor} z-50`}
    >
      {message}
    </div>
  );
};
