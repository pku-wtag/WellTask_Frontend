import React from "react";
import classNames from "classnames";
import { FieldWrapper } from "./FieldWrapper";

export interface TextareaProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  hint?: string;
  fullWidth?: boolean;
  className?: string;
}

export function Textarea({
  id,
  name,
  label,
  placeholder,
  hint,
  fullWidth = false,
  className,
}: TextareaProps) {
  const inputClass = classNames(
    "input",
    { "input-full": fullWidth },
    className
  );

  return (
    <FieldWrapper id={id} name={name} label={label} hint={hint}>
      {(input) => (
        <textarea
          {...input}
          id={id}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </FieldWrapper>
  );
}
