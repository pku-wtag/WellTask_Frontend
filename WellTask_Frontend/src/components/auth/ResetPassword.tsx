import { useEffect } from "react";
import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";
import { passwordStrength } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  type AuthErrorCodeType,
} from "@/redux/thunks/authThunks";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { Dialog } from "../base-component/Dialog";
import { useAuthMessage } from "@/hooks/useAuthMessage";
import type { FormApi } from "final-form";
import { authPageConfigs } from "./authPageConfigs";
import { clearForgotPasswordFlow } from "@/redux/slices/authSlice";

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { message, error } = useAuthMessage(3000);

  const forgotEmail = useSelector((state: RootState) => state.auth.forgotEmail);

  const layout = authPageConfigs.resetPassword;

  useEffect(() => {
    if (!forgotEmail && !message) {
      navigate("/forgot-password");
    }
  }, [forgotEmail, message, navigate]);

  const formFields: FormField[] = [
    {
      id: "password",
      name: "password",
      label: "New Password",
      placeholder: "Enter your new password",
      inputType: "password",
      fieldType: "input",
      validate: (value) => {
        if (!value) return "This field is required";
        return passwordStrength(value);
      },
    },
    {
      id: "confirmPassword",
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your new password",
      inputType: "password",
      fieldType: "input",
      validate: (value, allValues) => {
        if (!value) return "This field is required";
        if (value !== allValues?.password) return "Passwords do not match";
        return undefined;
      },
    },
  ];

  const handleSubmit = async (
    values: Record<string, string>,
    form: FormApi<Record<string, string>>
  ) => {
    try {
      await dispatch(resetPassword({ password: values.password })).unwrap();
      form.reset();
      formFields.forEach((f) => form.resetFieldState(f.name));
      setTimeout(() => {
        navigate("/login");
        dispatch(clearForgotPasswordFlow());
      }, 1000);
    } catch (err) {
      const payload = err as { code?: AuthErrorCodeType; message: string };

      formFields.forEach((f) => form.resetFieldState(f.name));

      if (payload.code === "NO_ACCOUNT") {
        setTimeout(() => navigate("/signup"), 1500);
        return;
      }

      throw new Error(
        payload?.message || "Something went wrong. Please try again."
      );
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
        onSubmit={handleSubmit}
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
                placeholder={field.placeholder}
                inputType={field.inputType}
                fullWidth
                validate={field.validate}
              />
            ))}

            <Button htmlType="submit" fullWidth disabled={submitting}>
              Update Password
            </Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}
