import { SidePanel } from "@/components/base-component/SidePanel";
import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { email, passwordStrength } from "@/utils/validators";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/redux/store";
import { loginUser } from "@/redux/thunks/authThunks";
import { Dialog } from "../base-component/Dialog";
import { Button } from "@/components/base-component/Button";
import { useAuthMessage } from "@/hooks/useAuthMessage";
import { setAuthUser } from "@/redux/slices/authSlice";
import type { FormApi } from "final-form";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { message, error } = useAuthMessage(3000);

  const panel = {
    title: "Welcome Back!",
    subtitle: "Get back to your dashboard",
    showAppButtons: true,
    position: "right" as "left" | "right",
    isVisible: true,
  };

  const form: {
    title: string;
    description: string;
    submitText: string;
    redirectLink: { text: string; path: string };
    fields: FormField[];
  } = {
    title: "Log in to Your Account",
    description: "Enter your credentials to continue",
    submitText: "Log In",
    redirectLink: { text: "Don't have an account?", path: "/signup" },
    fields: [
      {
        id: "email",
        name: "email",
        label: "Email Address",
        hint: "Example: name@gmail.com",
        placeholder: "Enter your email",
        fieldType: "input",
        inputType: "email",
        validate: email,
      },
      {
        id: "password",
        name: "password",
        label: "Password",
        hint: "Enter your password",
        placeholder: "Enter your password",
        fieldType: "input",
        inputType: "password",
        validate: passwordStrength,
      },
    ],
  };

  const handleLogin = async (
    values: Record<string, unknown>,
    form: FormApi<Record<string, unknown>>
  ) => {
    try {
      const user = await dispatch(
        loginUser({
          email: String(values.email),
          password: String(values.password),
        })
      ).unwrap();

      dispatch(setAuthUser({ user }));
      form.reset();
      form.getRegisteredFields().forEach((f) => form.resetFieldState(f));

      navigate("/dashboard");
    } catch (err) {
      const payload = err as { code?: string; message: string };

      if (payload?.code === "NO_ACCOUNT") {
        setTimeout(() => navigate("/signup"), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {(message || error) && (
        <Dialog
          message={message || error || ""}
          type={message ? "success" : "error"}
          duration={3000}
        />
      )}

      <div className="flex h-[90vh] rounded-2xl overflow-hidden shadow-lg w-3/4 max-w-7xl mx-auto">
        <div className="flex-1 flex items-center justify-center bg-white p-10">
          <div className="w-full max-w-md">
            <FormPanel
              title={form.title}
              description={form.description}
              submitText={form.submitText}
              redirectLink={form.redirectLink}
              fields={form.fields}
              onSubmit={handleLogin}
            />

            <div className="text-right mt-4 mr-10">
              <Button
                type="outline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </div>
          </div>
        </div>

        <SidePanel
          title={panel.title}
          subtitle={panel.subtitle}
          position={panel.position}
          showAppButtons={panel.showAppButtons}
          isVisible={panel.isVisible}
        />
      </div>
    </div>
  );
}
