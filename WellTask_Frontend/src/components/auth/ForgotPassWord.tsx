import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";

export default function ForgotPassword() {
  const layout = {
    title: "Forgot Password?",
    description:
      "We are sorry to hear that happened. Don’t be sad, we could help you get back to productivity in no time.",
    url: { label: "Create Account", path: "/signup" },
    alert: {
      title: "Hello Mano,",
      message: "You need to send a recovery link to this email!",
    },
  };

  const form: {
    fields: FormField[];
    submitText: string;
  } = {
    fields: [
      {
        id: "email",
        name: "email",
        label: "Email Address",
        hint: "Example: name@gmail.com",
        placeholder: "Enter your email",
        inputType: "email",
        fieldType: "input",
      },
    ],
    submitText: "Next",
  };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      url={layout.url}
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
                hint={field.hint}
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
