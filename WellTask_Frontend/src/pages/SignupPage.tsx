import { FormPanel } from "../components/base-component/FormPanel";
import { SidePanel } from "../components/base-component/SidePanel";

export default function SignupPage() {
  const panelObj = {
    title: "Take your productivity to the next level.",
    subtitle: "Get the Mobile App",
    showAppButtons: true,
    position: "left" as "left" | "right",
  };

  const formObj = {
    title: "Create an Account",
    description: "It's Simple and Easy!",
    submitText: "Create Account",
    redirectLink: { text: "Already have an account?", to: "/login" },
    fields: [
      {
        id: "fullname",
        name: "fullname",
        label: "Fullname",
        hint: "Information about the input",
        placeholder: "Enter your full name",
      },
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
        hint: "Use 8 characters with an uppercase, lowercase, symbol, and number.",
        placeholder: "Enter your password",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex h-[90vh] rounded-2xl overflow-hidden shadow-lg w-3/4 max-w-7xl">
        <SidePanel
          title={panelObj.title}
          subtitle={panelObj.subtitle}
          position={panelObj.position}
          showAppButtons={panelObj.showAppButtons}
        />
        <FormPanel
          title={formObj.title}
          description={formObj.description}
          submitText={formObj.submitText}
          redirectLink={formObj.redirectLink}
          fields={formObj.fields}
        />
      </div>
    </div>
  );
}
