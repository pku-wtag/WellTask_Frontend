import React from "react";
import { Field } from "react-final-form";

interface FieldWrapperProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  hint?: string;
  children: (input: any, meta: any) => React.ReactNode;
}

export function FieldWrapper({
  id,
  name,
  label,
  hint,
  children,
}: FieldWrapperProps) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <div className="mb-4">
          {label && (
            <label htmlFor={id} className="block mb-1 text-sm font-medium">
              {label}
            </label>
          )}

          {children(input, meta)}

          {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
          {meta?.touched && meta?.error && (
            <div className="text-xs text-red-500 mt-1">{meta.error}</div>
          )}
        </div>
      )}
    </Field>
  );
}
