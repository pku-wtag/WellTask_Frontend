import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { SidePanel } from "@/components/base-component/SidePanel";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { AppDispatch } from "@/redux/store";
import { Dialog } from "@/components/base-component/Dialog";
import { setWorkspace, type Workspace } from "@/redux/slices/workspaceSlice";

export default function WorkspacePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [dialog, setDialog] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const panel = {
    title: "Create Your Workspace",
    subtitle: "Set up your workspace and start collaborating",
    showAppButtons: false,
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
    title: "New Workspace",
    description: "Fill out the details to create your workspace",
    submitText: "Create Workspace",
    redirectLink: { text: "Already have a workspace?", path: "/login" },
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

  const handleCreateWorkspace = (values: Record<string, unknown>) => {
    const workspaceName = String(values.workspaceName ?? "");
    const workspaceType = String(values.workspaceType ?? "");
    const workspaceDescription = String(values.workspaceDescription ?? "");

    if (!workspaceName || !workspaceType) {
      setDialog({
        message: "Please fill out all required fields.",
        type: "error",
      });
      return;
    }

    const newWorkspace: Workspace = {
      name: workspaceName,
      type: workspaceType,
      description: workspaceDescription,
    };

    dispatch(setWorkspace(newWorkspace));
    setDialog({
      message: "Workspace created successfully! Redirecting...",
      type: "success",
    });

    setTimeout(() => navigate("/dashboard"), 1500);
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

        <FormPanel
          title={form.title}
          description={form.description}
          submitText={form.submitText}
          redirectLink={form.redirectLink}
          fields={form.fields}
          onSubmit={handleCreateWorkspace}
        />
      </div>
    </div>
  );
}
