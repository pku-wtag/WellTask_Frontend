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

export function SelectBox({
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
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldWrapper>
  );
}
