import React from "react";
import classNames from "classnames";
import { FieldWrapper } from "./FieldWrapper";
import type { ValidatorFn } from "./FieldWrapper";

interface InputProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  hint?: string;
  inputType?: string;
  fullWidth?: boolean;
  maxLength?: number;
  className?: string;
  validate?: ValidatorFn<string>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      hint,
      inputType = "text",
      fullWidth = false,
      maxLength,
      className,
      validate,
      onChange,
      onKeyDown,
      onPaste,
    },
    ref
  ) => {
    return (
      <FieldWrapper<string>
        id={id}
        name={name}
        label={label}
        hint={hint}
        validate={validate}
      >
        {(input, meta) => {
          const inputClass = classNames(
            "input p-2 border rounded",
            {
              "w-full": fullWidth,
              "border-red-500": meta.touched && meta.error,
            },
            className
          );

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            input.onChange(e);
            if (onChange) {
              onChange(e);
            }
          };

          if (onKeyDown) {
            const handleKeyDown = (
              e: React.KeyboardEvent<HTMLInputElement>
            ) => {
              onKeyDown(e);
            };
            return (
              <input
                {...input}
                ref={ref}
                id={id}
                type={inputType}
                placeholder={placeholder}
                className={inputClass}
                maxLength={maxLength}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={onPaste}
              />
            );
          }

          return (
            <input
              {...input}
              ref={ref}
              id={id}
              type={inputType}
              placeholder={placeholder}
              className={inputClass}
              maxLength={maxLength}
              onChange={handleChange}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
            />
          );
        }}
      </FieldWrapper>
    );
  }
);
