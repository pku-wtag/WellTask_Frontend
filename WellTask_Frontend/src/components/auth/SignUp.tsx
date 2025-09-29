import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { SidePanel } from "@/components/base-component/SidePanel";
import { required, email, passwordStrength } from "@/utils/validators";
import {
  signupSuccess,
  startLoading,
  type User,
} from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { useState } from "react";
import { Dialog } from "../base-component/Dialog";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [dialog, setDialog] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const panel = {
    title: "Take your productivity to the next level.",
    subtitle: "Get the Mobile App",
    showAppButtons: true,
    position: "left" as "left" | "right",
    isVisible: true,
  };

  const form: {
    title: string;
    description: string;
    submitText: string;
    redirectLink: { text: string; path: string };
    fields: FormField[];
  } = {
    title: "Create an Account",
    description: "It's Simple and Easy!",
    submitText: "Create Account",
    redirectLink: { text: "Already have an account?", path: "/login" },
    fields: [
      {
        id: "fullname",
        name: "fullname",
        label: "Fullname",
        hint: "Information about the input",
        placeholder: "Enter your full name",
        fieldType: "input",
        inputType: "text",
        validate: required,
      },
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
        hint: "Use 8 characters with an uppercase, lowercase, symbol, and number.",
        placeholder: "Enter your password",
        fieldType: "input",
        inputType: "password",
        validate: passwordStrength,
      },
    ],
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    dispatch(startLoading());

    if (!values.fullname || !values.email || !values.password) {
      setDialog({ message: "All fields are required", type: "error" });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      fullname: String(values.fullname),
      email: String(values.email),
      password: String(values.password),
      token: "dummy-token",
    };

    dispatch(signupSuccess(user));
    setDialog({
      message: "Signup successful! Redirecting to login...",
      type: "success",
    });

    setTimeout(() => navigate("/login"), 1500);
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
        <SidePanel
          title={panel.title}
          subtitle={panel.subtitle}
          position={panel.position}
          showAppButtons={panel.showAppButtons}
          isVisible={panel.isVisible}
        />
        <div className="flex-1 p-6 flex flex-col justify-center">
          <FormPanel
            title={form.title}
            description={form.description}
            submitText={isLoading ? "Creating..." : form.submitText}
            redirectLink={form.redirectLink}
            fields={form.fields}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
