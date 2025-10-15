import React from "react";
import { Field } from "react-final-form";
import type { FieldRenderProps } from "react-final-form";

interface FieldWrapperProps<T = string> {
  id: string;
  name: string;
  label?: React.ReactNode;
  hint?: string;
  children: (
    input: FieldRenderProps<T>["input"],
    meta: FieldRenderProps<T>["meta"]
  ) => React.ReactNode;
}

export function FieldWrapper<T = string>({
  id,
  name,
  label,
  hint,
  children,
}: FieldWrapperProps<T>) {
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
