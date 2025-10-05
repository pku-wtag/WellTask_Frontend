import { SidePanel } from "@/components/base-component/SidePanel";
import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { required, email } from "@/utils/validators";
import {
  loginSuccess,
  startLoading,
  type User,
} from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RootState } from "@/redux/store";
import { Dialog } from "../base-component/Dialog";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [dialog, setDialog] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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
        validate: required,
      },
    ],
  };

  const handleLogin = (values: Record<string, unknown>) => {
    dispatch(startLoading());

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setDialog({
        message: "No account found. Please sign up.",
        type: "error",
      });
      return;
    }

    const user: User = JSON.parse(savedUser);
    const emailValue = String(values.email);
    const passwordValue = String(values.password);

    if (emailValue === user.email && passwordValue === user.password) {
      dispatch(loginSuccess(user));
      setDialog({
        message: "Login successful! Redirecting...",
        type: "success",
      });

      setTimeout(() => navigate("/workspace"), 1500);
    } else {
      setDialog({ message: "Invalid email or password.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {dialog && (
        <Dialog
          message={dialog.message}
          type={dialog.type}
          onClose={() => setDialog(null)}
        />
      )}
      <div className="flex h-[90vh] rounded-2xl overflow-hidden shadow-lg w-3/4 max-w-7xl">
        <FormPanel
          title={form.title}
          description={form.description}
          submitText={isLoading ? "Logging in..." : form.submitText}
          redirectLink={form.redirectLink}
          fields={form.fields}
          onSubmit={handleLogin}
        />
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
