import React from "react";

type InputVariant = "default" | "error" | "success";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  fullWidth?: boolean;
  label?: string;
  hint?: string;
  id: string;
}

const baseStyles =
  "rounded-lg px-4 py-2 border font-medium outline-none transition-colors duration-200";

const variantStyles: Record<InputVariant, string> = {
  default:
    "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500",
  error: "border-red-500 focus:ring-2 focus:ring-red-400",
  success: "border-green-500 focus:ring-2 focus:ring-green-400",
};

export function Input({
  variant = "default",
  fullWidth = false,
  label,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseStyles} 
        ${variantStyles[variant]} 
        ${fullWidth ? "w-full" : ""} 
        ${className}`}
        {...props}
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
