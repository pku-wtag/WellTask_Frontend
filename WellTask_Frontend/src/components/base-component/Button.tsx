import React from "react";
import classNames from "classnames";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const buttonClass = classNames(
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    { "btn-full": fullWidth },
    className
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
