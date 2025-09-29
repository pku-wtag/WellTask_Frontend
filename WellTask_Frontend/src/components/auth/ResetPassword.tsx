import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";

export default function ResetPassword() {
  const layout = {
    title: "Set New Password",
    description:
      "Enter your new password below. Make sure it’s strong and easy to remember.",
    topRightLink: { label: "Back to Login", path: "/login" },
    alert: {
      title: "Hello Mano,",
      message: "You are about to reset your password.",
    },
  };

  const form: {
    fields: FormField[];
    submitText: string;
  } = {
    fields: [
      {
        id: "password",
        name: "password",
        label: "New Password",
        inputType: "password",
        placeholder: "Enter your new password",
        fieldType: "input",
      },
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        inputType: "password",
        placeholder: "Confirm your new password",
        fieldType: "input",
      },
    ],
    submitText: "Update Password",
  };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      topRightLink={layout.topRightLink}
      alert={layout.alert}
    >
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {form.fields.map((field) => (
              <Input
                key={field.id}
                id={field.id}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                inputType={field.inputType}
                fullWidth
              />
            ))}
            <Button htmlType="submit" fullWidth>
              {form.submitText}
            </Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}
