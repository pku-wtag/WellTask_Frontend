import React from "react";
import classNames from "classnames";

type InputVariant = "default" | "error" | "success";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  fullWidth?: boolean;
  label?: React.ReactNode;
  hint?: string;
  id: string;
  className?: string;
}

export function Input({
  variant = "default",
  fullWidth = false,
  label,
  hint,
  id,
  className,
  ...props
}: InputProps) {
  const inputClass = classNames(
    "input",
    `input-${variant}`,
    { "input-full": fullWidth },
    className
  );

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input id={id} className={inputClass} {...props} />
      {hint && <p className="input-hint">{hint}</p>}
    </div>
  );
}
