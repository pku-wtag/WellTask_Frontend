import React from "react";
import { Field } from "react-final-form";
import type { FieldInputProps, FieldRenderProps } from "react-final-form";

export type ValidatorFn<T = string> = (
  value: T,
  allValues?: Record<string, T>
) => string | undefined;

interface FieldWrapperProps<T = string> {
  id: string;
  name: string;
  label?: React.ReactNode;
  hint?: string;
  validate?: ValidatorFn<T>;
  children: (
    input: FieldInputProps<T, HTMLElement>,
    meta: FieldRenderProps<T, HTMLElement>["meta"]
  ) => React.ReactNode;
}

export function FieldWrapper<T = string>({
  id,
  name,
  label,
  hint,
  validate,
  children,
}: FieldWrapperProps<T>) {
  return (
    <Field<T>
      name={name}
      validate={
        validate
          ? (value, allValues) => {
              return validate(value, allValues as Record<string, T>);
            }
          : undefined
      }
    >
      {({ input, meta }) => {
        return (
          <div className="mb-4">
            {label && (
              <label htmlFor={id} className="block mb-1 text-sm font-medium">
                {label}
              </label>
            )}

            {children(input, meta)}

            {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}

            {meta.touched && meta.error && (
              <div className="text-xs text-red-500 mt-1">{meta.error}</div>
            )}
          </div>
        );
      }}
    </Field>
  );
}
