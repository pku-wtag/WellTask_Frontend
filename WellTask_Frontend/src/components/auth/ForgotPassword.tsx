import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { Input } from "@/components/base-component/Input";
import { Form } from "react-final-form";

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

  const formObj = {
    fields: [
      {
        id: "email",
        name: "email",
        label: "Email Address",
        fieldType: "input" as const,
        inputType: "email",
        placeholder: "Enter your email",
      },
    ],
    submitText: "Next",
  };

  const handleSubmit = (values: any) => {
    console.log("Forgot Password submitted:", values);
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
