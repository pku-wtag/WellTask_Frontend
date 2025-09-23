import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";

interface FormField {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  hint?: string;
}

export default function ResetPassword() {
  const layoutObj = {
    title: "Set New Password",
    description:
      "Enter your new password below. Make sure it’s strong and easy to remember.",
    topRightLink: { label: "Back to Login", to: "/login" },
    alert: {
      title: "Hello Mano,",
      message: "You are about to reset your password.",
    },
  };

  const formObj: {
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
      },
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        inputType: "password",
        placeholder: "Confirm your new password",
      },
    ],
    submitText: "Update Password",
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
