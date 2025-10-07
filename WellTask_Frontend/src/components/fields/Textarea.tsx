import React from "react";
import classNames from "classnames";
import { FieldWrapper, type ValidatorFn } from "./FieldWrapper";

export interface TextareaProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  hint?: string;
  fullWidth?: boolean;
  className?: string;
  validate?: ValidatorFn<string>;
}

export function Textarea({
  id,
  name,
  label,
  placeholder,
  hint,
  fullWidth = false,
  className,
  validate,
}: TextareaProps) {
  const inputClass = classNames(
    "input",
    { "input-full": fullWidth },
    className
  );

  return (
    <FieldWrapper id={id} name={name} label={label} hint={hint} validate={validate}>
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
