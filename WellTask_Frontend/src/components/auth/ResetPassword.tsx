import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";
import { required, passwordStrength, match } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { useState } from "react";
import { Dialog } from "../base-component/Dialog";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [dialog, setDialog] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const savedUser = localStorage.getItem("user");
  const users = savedUser ? JSON.parse(savedUser) : null;

  const layout = {
    title: "Set New Password",
    description:
      "Enter your new password below. Make sure it’s strong and easy to remember.",
    url: { label: "Back to Login", path: "/login" },
    alert: {
      title: users ? `Hello ${users.fullname},` : "Hello,",
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
        validate: (value) => required(value) || passwordStrength(value),
      },
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        inputType: "password",
        placeholder: "Confirm your new password",
        fieldType: "input",
        validate: (value, allValues) =>
          required(value) ||
          match(allValues?.password as string | undefined)(value),
      },
    ],
    submitText: "Update Password",
  };

  const handleSubmit = (values: Record<string, string>) => {
    if (user) {
      dispatch(updateUser({ password: values.password }));
      setDialog({ message: "Password updated successfully!", type: "success" });

      setTimeout(() => navigate("/login"), 1500);
    } else {
      setDialog({
        message: "No user found! Please sign up first.",
        type: "error",
      });
      setTimeout(() => navigate("/signup"), 1500);
    }
  };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      url={layout.url}
      alert={layout.alert}
    >
      {dialog && (
        <Dialog
          message={dialog.message}
          type={dialog.type}
          onClose={() => setDialog(null)}
        />
      )}

      <Form
        onSubmit={handleSubmit}
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
                validate={field.validate}
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
