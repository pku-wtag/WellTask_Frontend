import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";
import { email } from "@/utils/validators";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/redux/store";
import { sendRecoveryLink } from "@/redux/thunks/authThunks";
import { Dialog } from "../base-component/Dialog";
import { useAuthMessage } from "@/hooks/useAuthMessage";
import type { FormApi } from "final-form";
import { authPageConfigs } from "./authPageConfigs";
import { setForgotEmail } from "@/redux/slices/authSlice";

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { message, error } = useAuthMessage(3000);

  const layout = authPageConfigs.forgotPassword;

  const formFields: FormField[] = [
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
  ];

  const handleForgotPassword = async (
    values: Record<string, unknown>,
    form: FormApi<Record<string, unknown>>
  ) => {
    const emailValue = String(values.email);

    try {
      dispatch(setForgotEmail(emailValue));
      await dispatch(sendRecoveryLink(emailValue)).unwrap();
      form.reset();
      formFields.forEach((f) => form.resetFieldState(f.name));

      setTimeout(() => navigate("/verify-code"), 1000);
    } catch (err) {
      const payload = err as { code?: string; message: string };
      if (payload?.code === "NO_ACCOUNT") {
        setTimeout(() => navigate("/signup"), 1000);
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
        render={({ handleSubmit, form, submitting }) => (
          <form
            onSubmit={async (event) => {
              const result = await handleSubmit(event);

              form.reset();
              formFields.forEach((f) => form.resetFieldState(f.name));

              return result;
            }}
            className="space-y-5 text-left"
          >
            {formFields.map((field) => (
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

            <Button htmlType="submit" fullWidth disabled={submitting}>
              Next
            </Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}
