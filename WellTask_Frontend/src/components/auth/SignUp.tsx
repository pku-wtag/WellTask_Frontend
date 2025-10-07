import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { SidePanel } from "@/components/base-component/SidePanel";
import { required, email, passwordStrength } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/redux/store";
import { signupUser } from "@/redux/thunks/authThunks";
import { Dialog } from "../base-component/Dialog";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {error, message } = useSelector(
    (state: RootState) => state.auth
  );

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
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        hint: "Re-enter your password",
        placeholder: "Confirm your password",
        fieldType: "input",
        inputType: "password",
        validate: (value, allValues) => {
          if (!value) return "This field is required";
          if (allValues?.password !== value) return "Passwords do not match";
          return undefined;
        },
      },
    ],
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    await dispatch(
      signupUser({
        fullname: String(values.fullname),
        email: String(values.email),
        password: String(values.password),
      })
    ).unwrap();
    setTimeout(() => navigate("/login"), 1500);
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
            submitText={form.submitText}
            redirectLink={form.redirectLink}
            fields={form.fields}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
