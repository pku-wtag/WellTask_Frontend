import { Form } from "react-final-form";
import { Button } from "@/components/base-component/Button";
import { Input } from "../fields/Input";
import { Textarea } from "../fields/Textarea";
import { SelectBox } from "../fields/Select";
import { Checkbox } from "../fields/Checkbox";
import { Radio } from "../fields/Radio";
import { Link } from "react-router-dom";

export type Option = { value: string; label: string };

export interface FormField<T = string> {
  id: string;
  name: string;
  label?: React.ReactNode;
  inputType?: string;
  hint?: string;
  placeholder?: string;
  options?: Option[];
  fieldType: "input" | "textarea" | "select" | "checkbox" | "radio";
  validate?: (value: T, allValues?: Record<string, unknown>) => string | undefined;
}

interface FormProps {
  title: string;
  description?: string;
  submitText: string;
  redirectLink?: { text: string; path: string };
  fields: FormField[];
  onSubmit?: (values: Record<string, unknown>) => void;
}

export function FormPanel({
  title,
  description,
  submitText,
  redirectLink,
  fields,
  onSubmit,
}: FormProps) {
  const renderField = (field: FormField) => {
    switch (field.fieldType) {
      case "input":
        return (
          <Input
            key={field.id}
            id={field.id}
            name={field.name}
            label={field.label}
            hint={field.hint}
            placeholder={field.placeholder}
            inputType={field.inputType}
            fullWidth
            validate={field.validate}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={field.id}
            id={field.id}
            name={field.name}
            label={field.label}
            hint={field.hint}
            placeholder={field.placeholder}
            fullWidth
          />
        );

      case "select":
        return (
          <SelectBox
            key={field.id}
            id={field.id}
            name={field.name}
            label={field.label}
            hint={field.hint}
            options={field.options ?? []}
            fullWidth
          />
        );

      case "checkbox":
        return (
          <Checkbox
            key={field.id}
            id={field.id}
            name={field.name}
            label={field.label}
            hint={field.hint}
          />
        );

      case "radio":
        return (
          <Radio
            key={field.id}
            name={field.name}
            label={field.label}
            hint={field.hint}
            options={field.options ?? []}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-10 flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
        {description && <p className="text-sm text-gray-500 mb-8">{description}</p>}

        <Form
          onSubmit={onSubmit || (() => {})}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {fields.map(renderField)}
              <Button htmlType="submit" fullWidth disabled={submitting}>
                {submitText}
              </Button>
            </form>
          )}
        />

        {redirectLink && (
          <div className="text-sm text-gray-500 mt-4">
            <p className="flex items-center gap-1">
              <span>{redirectLink.text}</span>
              <Link to={redirectLink.path} className="text-blue-600 underline">
                {redirectLink.path.replace("/", "")}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
