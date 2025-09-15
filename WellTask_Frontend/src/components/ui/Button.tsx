import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const baseStyles = "rounded-lg font-medium transition-colors duration-200";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} 
      ${variantStyles[variant]} 
      ${sizeStyles[size]} 
      ${fullWidth ? "w-full" : ""} 
      ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
