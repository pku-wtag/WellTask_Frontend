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
import type { RootState, AppDispatch } from "@/redux/store";
import { Dialog } from "../base-component/Dialog";
import { setError, setMessage } from "@/redux/slices/authSlice";
import { authPageConfigs } from "./authPageConfigs";

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { message, error, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

   const layout = authPageConfigs.resetPassword;

  const form: { fields: FormField[]; submitText: string } = {
    fields: [
      {
        id: "password",
        name: "password",
        label: "New Password",
        inputType: "password",
        placeholder: "Enter your new password",
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
        inputType: "password",
        placeholder: "Confirm your new password",
        fieldType: "input",
        validate: (value, allValues) => {
          if (!value) return "This field is required";
          if (value !== allValues?.password) return "Passwords do not match";
          return undefined;
        },
      },
    ],
    submitText: "Update Password",
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      await dispatch(resetPassword({ password: values.password })).unwrap();
      dispatch(setMessage("Password updated successfully!"));
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const payload = err as { code?: AuthErrorCodeType; message: string };
      const msg = payload?.message || "Something went wrong. Please try again.";
      dispatch(setError(msg));
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
            <Button htmlType="submit" fullWidth disabled={isLoading}>
              {form.submitText}
            </Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}
