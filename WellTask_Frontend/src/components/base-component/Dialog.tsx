import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearMessage, clearError } from "@/redux/slices/authSlice";

interface DialogProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export const Dialog = ({ message, type = "info", duration = 3000 }: DialogProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type === "success") dispatch(clearMessage());
      if (type === "error") dispatch(clearError());
    }, duration);

    return () => clearTimeout(timer);
  }, [dispatch, duration, type]);

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
