import React from "react";
import { Field } from "react-final-form";
import classNames from "classnames";

type InputType = "default" | "error" | "success";
export type FieldType = "input" | "textarea" | "select" | "checkbox" | "radio";
export type Option = { value: string; label: string };

export interface InputProps {
  type?: InputType;
  fullWidth?: boolean;
  label?: React.ReactNode;
  hint?: string;
  id: string;
  className?: string;
  name: string;
  fieldType?: FieldType;
  inputType?: string;
  options?: Option[];
  placeholder?: string;
  maxLength?: number;
}

export function Input({
  type = "default",
  fullWidth = false,
  label,
  hint,
  id,
  className,
  name,
  fieldType = "input",
  inputType = "text",
  options = [],
  placeholder,
  maxLength,
}: InputProps) {
  const inputClass = classNames(
    "input",
    `input-${type}`,
    { "input-full": fullWidth },
    className
  );

  return (
    <Field name={name}>
      {({ input, meta }: any) => (
        <div className="mb-4">
          {fieldType !== "checkbox" && label && (
            <label htmlFor={id} className="block mb-1 text-sm font-medium">
              {label}
            </label>
          )}

          {fieldType === "input" && (
            <input
              {...input}
              id={id}
              type={inputType}
              placeholder={placeholder}
              className={inputClass}
              maxLength={maxLength}
            />
          )}

          {fieldType === "textarea" && (
            <textarea
              {...input}
              id={id}
              placeholder={placeholder}
              className={inputClass}
            />
          )}

          {fieldType === "select" && (
            <select {...input} id={id} className={inputClass}>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {fieldType === "checkbox" && (
            <div className="flex items-center gap-2">
              <input
                id={id}
                type="checkbox"
                checked={!!input.value}
                onChange={(e) => input.onChange(e.target.checked)}
                onBlur={() => input.onBlur(input.value)}
                className="w-4 h-4"
              />
              {label && <span>{label}</span>}
            </div>
          )}

          {fieldType === "radio" && options.length > 0 && (
            <div className="flex flex-col gap-1">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    name={input.name}
                    type="radio"
                    value={opt.value}
                    checked={input.value === opt.value}
                    onChange={() => input.onChange(opt.value)}
                    className="w-4 h-4"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}

          {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
          {meta?.touched && meta?.error && (
            <div className="text-xs text-red-500 mt-1">{meta.error}</div>
          )}
        </div>
      )}
    </Field>
  );
}
