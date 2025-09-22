import React from "react";
import { Form } from "react-final-form";
import { Button } from "./Button";
import { Input } from "./Input";
import { Link } from "react-router-dom";

export type Option = { value: string; label: string };

export interface FormField {
  id: string;
  name: string;
  label: React.ReactNode;
  inputType?: string;
  hint?: string;
  placeholder?: string;
  options?: Option[];
  fieldType?: "input" | "textarea" | "select" | "checkbox" | "radio";
}

interface FormProps {
  title: string;
  description?: string;
  submitText: string;
  redirectLink?: { text: string; to: string };
  fields: FormField[];
}

export function FormPanel({
  title,
  description,
  submitText,
  redirectLink,
  fields,
}: FormProps) {
  return (
    <div className="flex-1 p-10 flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mb-8">{description}</p>
        )}

        <Form
          onSubmit={() => {}}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field) => (
                <Input
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  fieldType={field.fieldType ?? "input"}
                  inputType={field.inputType ?? "text"}
                  label={field.label}
                  hint={field.hint}
                  placeholder={field.placeholder}
                  options={field.options}
                  fullWidth
                />
              ))}
              <Button htmlType="submit" fullWidth>
                {submitText}
              </Button>
            </form>
          )}
        />

        {redirectLink && (
          <div className="text-sm text-gray-500 mt-4">
            <p className="flex items-center gap-1">
              <span>{redirectLink.text}</span>
              <Link to={redirectLink.to} className="text-blue-600 underline">
                {redirectLink.to.replace("/", "")}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
