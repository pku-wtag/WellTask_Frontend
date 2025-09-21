import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { Input } from "@/components/base-component/Input";

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
        type: "password",
        placeholder: "Enter your new password",
      },
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
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
