import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { Input } from "@/components/base-component/Input";
import { Form } from "react-final-form";

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

  const formObj = {
    fields: [
      {
        id: "password",
        name: "password",
        label: "New Password",
        fieldType: "input" as const,
        inputType: "password",
        placeholder: "Enter your new password",
      },
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        fieldType: "input" as const,
        inputType: "password",
        placeholder: "Confirm your new password",
      },
    ],
    submitText: "Update Password",
  };

  const handleSubmit = (values: any) => {
    console.log("Reset Password submitted:", values);
  };

  return (
    <AuthCardLayout
      title={layoutObj.title}
      description={layoutObj.description}
      topRightLink={layoutObj.topRightLink}
      alert={layoutObj.alert}
    >
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {formObj.fields.map((field) => (
              <Input
                key={field.id}
                id={field.id}
                name={field.name}
                label={field.label}
                fieldType={field.fieldType}
                inputType={field.inputType}
                placeholder={field.placeholder}
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
