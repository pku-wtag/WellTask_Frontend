import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Link } from "react-router-dom";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type?: string;
  hint?: string;
  placeholder?: string;
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

        <form className="space-y-5">
          {fields.map((field) => (
            <Input
              key={field.id}
              id={field.id}
              name={field.name}
              type={field.type || "text"}
              label={field.label}
              hint={field.hint}
              placeholder={field.placeholder}
              fullWidth
            />
          ))}
          <Button fullWidth>{submitText}</Button>
        </form>

        {redirectLink && (
          <div className="text-sm text-gray-500 mt-4">
            <p>
              {redirectLink.text}{" "}
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
