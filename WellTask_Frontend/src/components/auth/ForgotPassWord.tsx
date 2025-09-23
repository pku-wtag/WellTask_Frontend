import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";

interface FormField {
  id: string;
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  inputType?: string;
}

export default function ForgotPassword() {
  const layoutObj = {
    title: "Forgot Password?",
    description:
      "We are sorry to hear that happened. Don’t be sad, we could help you get back to productivity in no time.",
    topRightLink: { label: "Create Account", to: "/signup" },
    alert: {
      title: "Hello Mano,",
      message: "You need to send a recovery link to this email!",
    },
  };

  const formObj: {
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
      },
    ],
    submitText: "Next",
  };

  return (
    <AuthCardLayout
      title={layoutObj.title}
      description={layoutObj.description}
      topRightLink={layoutObj.topRightLink}
      alert={layoutObj.alert}
    >
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {formObj.fields.map((field) => (
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
              {formObj.submitText}
            </Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}