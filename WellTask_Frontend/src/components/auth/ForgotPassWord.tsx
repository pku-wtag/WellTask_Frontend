import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";
import { email } from "@/utils/validators";
import { setError } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "../base-component/Dialog";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const layout = {
    title: "Forgot Password?",
    description:
      "We are sorry to hear that happened. Don’t be sad, we could help you get back to productivity in no time.",
    url: { label: "Create Account", path: "/signup" },
    alert: {
      title: user ? `Hello ${user.fullname},` : "Hello,",
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
        validate: email,
      },
    ],
    submitText: "Next",
  };

  const handleForgotPassword = (values: Record<string, unknown>) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setDialog({
        message: "No account found. Please sign up.",
        type: "error",
      });
      dispatch(setError("No account found. Please sign up."));
      return;
    }

    const user = JSON.parse(savedUser);
    const emailValue = String(values.email);

    if (emailValue === user.email) {
      setDialog({
        message: `Recovery link sent to ${user.email}`,
        type: "success",
      });

      setTimeout(() => navigate("/verify-code"), 1500);
    } else {
      setDialog({
        message: "Email not found. Please check or sign up.",
        type: "error",
      });
      dispatch(setError("Email not found. Please check or sign up."));
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
        onSubmit={handleForgotPassword}
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
