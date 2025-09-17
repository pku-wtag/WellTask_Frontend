import React from "react";
import classNames from "classnames";

type InputType = "default" | "error" | "success";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: InputType;
  htmlType?: string;
  fullWidth?: boolean;
  label?: React.ReactNode;
  hint?: string;
  id: string;
  className?: string;
}

export function Input({
  type = "default",
  fullWidth = false,
  label,
  hint,
  id,
  className,
  htmlType,
  ...props
}: InputProps) {
  const inputClass = classNames(
    "input",
    `input-${type}`,
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
      <input id={id} className={inputClass} type={htmlType} {...props} />
      {hint && <p className="input-hint">{hint}</p>}
    </div>
  );
}
