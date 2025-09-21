import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { Input } from "@/components/base-component/Input";

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
        type: "email",
        placeholder: "Enter your email",
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
      <form className="space-y-5 text-left">
        {formObj.fields.map((field) => (
          <Input
            key={field.id}
            id={field.id}
            name={field.name}
            htmlType={field.type}
            label={field.label}
            placeholder={field.placeholder}
            fullWidth
          />
        ))}
        <Button fullWidth>{formObj.submitText}</Button>
      </form>
    </AuthCardLayout>
  );
}
