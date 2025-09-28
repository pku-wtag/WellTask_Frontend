import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { SidePanel } from "@/components/base-component/SidePanel";

export default function Signup() {
  const panelObj = {
    title: "Take your productivity to the next level.",
    subtitle: "Get the Mobile App",
    showAppButtons: true,
    position: "left" as "left" | "right",
    isVisible: true,
  };

  const formObj: {
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
      },
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
        hint: "Use 8 characters with an uppercase, lowercase, symbol, and number.",
        placeholder: "Enter your password",
        fieldType: "input",
        inputType: "password",
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
          isVisible={panelObj.isVisible}
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
