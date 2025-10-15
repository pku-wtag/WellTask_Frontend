import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { Input } from "../../fields/Input";
import { AuthCardLayout } from "../../base-component/AuthCardLayout/AuthCardLayout";
import type { FormField } from "../../base-component/FormPanel/FormPanel";
import { email } from "@/utils/validators";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { Dialog } from "../../base-component/Dialog/Dialog";
import type { FormApi } from "final-form";
import { authPageConfigs } from "../authPageConfigs";
import { clearMessage, clearError } from "@/redux/slices/authSlice";
import { useMessage } from "@/hooks/useMessage";
import { MESSAGE_DURATION_MS, NAVIGATION_DELAY_MS } from "@/utils/constants";
import { forgotPassword } from "@/redux/thunks/authThunks";

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { message, error } = useMessage({
    selectSlice: (state: RootState) => state.auth,
    duration: MESSAGE_DURATION_MS,
    clearMessage,
    clearError,
  });

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

  const handleForgotPassword = async (values: Record<string, unknown>) => {
    const emailValue = String(values.email);

    const result = await dispatch(forgotPassword(emailValue));

    if (forgotPassword.fulfilled.match(result)) {
      setTimeout(() => {
        navigate("/verify-code");
      }, NAVIGATION_DELAY_MS);

      return;
    }

    if (forgotPassword.rejected.match(result)) {
      if (result.payload?.code === "NO_ACCOUNT") {
        setTimeout(() => {
          navigate("/signup");
        }, NAVIGATION_DELAY_MS);
      }

      return;
    }
  };

  const handleFormSubmit =
    (
      handleSubmit: (
        event?: SubmitEvent
      ) => Promise<Record<string, unknown> | undefined> | undefined,
      form: FormApi<Record<string, unknown>>
    ) =>
    async (event: React.FormEvent<HTMLFormElement>) => {
      const result = await handleSubmit(event.nativeEvent as SubmitEvent);

      form.reset();

      formFields.forEach((f) => form.resetFieldState(f.name));

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
        onSubmit={handleForgotPassword}
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
