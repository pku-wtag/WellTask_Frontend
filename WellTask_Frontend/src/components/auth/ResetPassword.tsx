import { useEffect } from "react";
import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../fields/Input";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import type { FormField } from "../base-component/FormPanel";
import { passwordStrength } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/redux/thunks/authThunks";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { Dialog } from "../base-component/Dialog";
import { useAuthMessage } from "@/hooks/useAuthMessage";
import type { FormApi } from "final-form";
import { authPageConfigs } from "./authPageConfigs";
import { clearForgotPasswordFlow } from "@/redux/slices/authSlice";
import { MESSAGE_DURATION_MS, NAVIGATION_DELAY_MS } from "@/utils/constants";
import { isAuthError } from "./ForgotPassword";

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { message, error } = useAuthMessage(MESSAGE_DURATION_MS);

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
        if (!value) {
          return "This field is required";
        }

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
        if (!value) {
          return "This field is required";
        }

        if (value !== allValues?.password) {
          return "Passwords do not match";
        }
      },
    },
  ];

  const handleResetPassword = async (
    values: Record<string, string>
  ): Promise<void> => {
    try {
      await dispatch(resetPassword({ password: values.password })).unwrap();

      setTimeout(() => {
        navigate("/login");
        dispatch(clearForgotPasswordFlow());
      }, NAVIGATION_DELAY_MS);

      return;
    } catch (err: unknown) {
      if (isAuthError(err) && err.code === "NO_ACCOUNT") {
        setTimeout(() => {
          navigate("/signup");
        }, NAVIGATION_DELAY_MS);

        return;
      }
    }
  };

  const handleFormSubmit =
    (
      handleSubmit: (
        event?: SubmitEvent
      ) => Promise<Record<string, string> | undefined> | undefined,
      form: FormApi<Record<string, string>>
    ) =>
    async (event: React.FormEvent<HTMLFormElement>) => {
      const result = await handleSubmit(event.nativeEvent as SubmitEvent);

      form.reset();

      formFields.forEach((f) => {
        form.resetFieldState(f.name);
      });

      return result;
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
          duration={MESSAGE_DURATION_MS}
        />
      )}

      <Form
        onSubmit={handleResetPassword}
        render={({ handleSubmit, form, submitting }) => (
          <form
            onSubmit={handleFormSubmit(handleSubmit, form)}
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
