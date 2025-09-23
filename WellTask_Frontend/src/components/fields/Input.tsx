import React from "react";
import classNames from "classnames";
import { FieldWrapper } from "./FieldWrapper";

export interface InputProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  hint?: string;
  inputType?: string;
  fullWidth?: boolean;
  maxLength?: number;
  className?: string;
}

export function Input({
  id,
  name,
  label,
  placeholder,
  hint,
  inputType = "text",
  fullWidth = false,
  maxLength,
  className,
}: InputProps) {
  const inputClass = classNames(
    "input",
    { "input-full": fullWidth },
    className
  );

  return (
    <FieldWrapper id={id} name={name} label={label} hint={hint}>
      {(input) => (
        <input
          {...input}
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={inputClass}
          maxLength={maxLength}
        />
      )}
    </FieldWrapper>
  );
}
