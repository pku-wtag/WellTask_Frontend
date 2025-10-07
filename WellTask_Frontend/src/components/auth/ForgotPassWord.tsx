import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";
import { email } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/redux/store";
import { sendRecoveryLink } from "@/redux/thunks/authThunks";
import { Dialog } from "../base-component/Dialog";
import { authPageConfigs } from "./authPageConfigs";

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { message, error } = useSelector((state: RootState) => state.auth);

  const layout = authPageConfigs.forgotPassword;

  const form: { fields: FormField[]; submitText: string } = {
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

  const handleForgotPassword = async (values: Record<string, unknown>) => {
    const emailValue = String(values.email);

    try {
      await dispatch(sendRecoveryLink(emailValue)).unwrap();
      setTimeout(() => navigate("/verify-code"), 1500);
    } catch (err) {
      const payload = err as { code?: string; message: string };
      if (payload?.code === "NO_ACCOUNT") {
        setTimeout(() => navigate("/signup"), 1500);
      }
    }
  };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      url={layout.url}
      alert={layout.alert}
    >
      {(message || error) && (
        <Dialog
          message={message || error || ""}
          type={message ? "success" : "error"}
          duration={3000}
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
