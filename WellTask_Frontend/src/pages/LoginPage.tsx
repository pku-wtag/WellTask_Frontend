import { SidePanel } from "../components/base-component/SidePanel";
import { FormPanel } from "../components/base-component/FormPanel";

export default function LoginPage() {
  const panelObj = {
    title: "Welcome Back!",
    subtitle: "Get back to your dashboard",
    showAppButtons: true,
    position: "right" as "left" | "right",
  };

  const formObj = {
    title: "Log in to Your Account",
    description: "Enter your credentials to continue",
    submitText: "Log In",
    redirectLink: { text: "Don't have an account?", to: "/signup" },
    fields: [
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        hint: "Example: name@gmail.com",
        placeholder: "Enter your email",
      },
      {
        id: "password",
        name: "password",
        label: "Password",
        type: "password",
        hint: "Enter your password",
        placeholder: "Enter your password",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex h-[90vh] rounded-2xl overflow-hidden shadow-lg w-3/4 max-w-7xl">
        <FormPanel
          title={formObj.title}
          description={formObj.description}
          submitText={formObj.submitText}
          redirectLink={formObj.redirectLink}
          fields={formObj.fields}
        />
        <SidePanel
          title={panelObj.title}
          subtitle={panelObj.subtitle}
          position={panelObj.position}
          showAppButtons={panelObj.showAppButtons}
        />
      </div>
    </div>
  );
}
