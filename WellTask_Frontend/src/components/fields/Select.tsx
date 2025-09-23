import React from "react";
import classNames from "classnames";
import { FieldWrapper } from "./FieldWrapper";

export type Option = { value: string; label: string };

export interface SelectProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  options: Option[];
  hint?: string;
  fullWidth?: boolean;
  className?: string;
}

export function Select({
  id,
  name,
  label,
  options,
  hint,
  fullWidth = false,
  className,
}: SelectProps) {
  const inputClass = classNames(
    "input",
    { "input-full": fullWidth },
    className
  );

  return (
    <FieldWrapper id={id} name={name} label={label} hint={hint}>
      {(input) => (
        <select {...input} id={id} className={inputClass}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FieldWrapper>
  );
}
