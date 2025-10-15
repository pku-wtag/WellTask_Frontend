import { SidePanel } from "@/components/base-component/SidePanel";
import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";

export default function Login() {
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
      },
      {
        id: "password",
        name: "password",
        label: "Password",
        hint: "Enter your password",
        placeholder: "Enter your password",
        fieldType: "input",
        inputType: "password",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex h-[90vh] rounded-2xl overflow-hidden shadow-lg w-3/4 max-w-7xl">
        <FormPanel
          title={form.title}
          description={form.description}
          submitText={form.submitText}
          redirectLink={form.redirectLink}
          fields={form.fields}
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
