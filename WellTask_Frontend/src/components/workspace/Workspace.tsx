import { FormPanel, type FormField } from "../base-component/FormPanel";
import { SidePanel } from "../base-component/SidePanel";

export default function Workspace() {
  const panelObj = {
    title: "Create Your Workspace",
    subtitle: "Set up your workspace and start collaborating",
    showAppButtons: false,
    position: "left" as "left" | "right",
    isVisible: true,
  };

  const formObj: {
    title: string;
    description: string;
    submitText: string;
    redirectLink: { text: string; to: string };
    fields: FormField[];
  } = {
    title: "New Workspace",
    description: "Fill out the details to create your workspace",
    submitText: "Create Workspace",
    redirectLink: { text: "Already have a workspace?", to: "/login" },
    fields: [
      {
        id: "workspaceName",
        name: "workspaceName",
        label: "Workspace Name",
        fieldType: "input",
        inputType: "text",
        hint: "A unique name for your workspace (e.g. Marketing Team)",
        placeholder: "Enter workspace name",
      },
      {
        id: "workspaceType",
        name: "workspaceType",
        label: "Workspace Type",
        fieldType: "select",
        options: [
          { value: "", label: "Select type" },
          { value: "business", label: "Business" },
          { value: "education", label: "Education" },
          { value: "engineering-it", label: "Engineering/IT" },
          { value: "marketing", label: "Marketing" },
          { value: "operations", label: "Operations" },
          { value: "personal", label: "Personal" },
          { value: "sales-crm", label: "Sales/CRM" },
          { value: "other", label: "Other" },
        ],
        hint: "Choose the type that best fits your workspace",
      },
      {
        id: "workspaceDescription",
        name: "workspaceDescription",
        label: "Workspace Description",
        fieldType: "textarea",
        hint: "Briefly describe the purpose of this workspace",
        placeholder: "Enter workspace description",
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
