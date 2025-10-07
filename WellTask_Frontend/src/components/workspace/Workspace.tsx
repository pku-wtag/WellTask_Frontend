import {
  FormPanel,
  type FormField,
} from "@/components/base-component/FormPanel";
import { SidePanel } from "@/components/base-component/SidePanel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { Dialog } from "@/components/base-component/Dialog";
import { Modal } from "../base-component/modal";
import { clearMessage, clearError } from "@/redux/slices/workspaceSlice";
import { addWorkspace } from "@/redux/thunks/workspaceThunks";
import { required } from "@/utils/validators";

interface WorkspacePageProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function Workspace({
  isModal = false,
  onClose,
}: WorkspacePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { message, error } = useSelector((state: RootState) => state.workspace);

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
    redirectLink: { text: "Already have a workspace?", path: "/dashboard" },
    fields: [
      {
        id: "workspaceName",
        name: "workspaceName",
        label: "Workspace Name",
        fieldType: "input",
        inputType: "text",
        hint: "A unique name for your workspace (e.g. Marketing Team)",
        placeholder: "Enter workspace name",
        validate: required,
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
        validate: required,
      },
      {
        id: "workspaceDescription",
        name: "workspaceDescription",
        label: "Workspace Description",
        fieldType: "textarea",
        hint: "Briefly describe the purpose of this workspace",
        placeholder: "Enter workspace description",
        validate: required,
      },
    ],
  };

  const handleCreateWorkspace = async (values: Record<string, unknown>) => {
    await dispatch(
      addWorkspace({
        name: String(values.workspaceName),
        type: String(values.workspaceType),
        description: String(values.workspaceDescription),
      })
    ).unwrap();

    setTimeout(() => {
      if (!isModal) navigate("/dashboard");
      if (onClose) onClose();
    }, 1000);
  };

  const content = (
    <>
      {(message || error) && (
        <Dialog
          message={message || error || ""}
          type={message ? "success" : "error"}
          duration={1000}
          onClose={() => {
            if (message) dispatch(clearMessage());
            if (error) dispatch(clearError());
          }}
        />
      )}

      <div
        className={`${
          isModal
            ? "w-full flex-1 overflow-auto"
            : "flex h-[90vh] rounded-2xl overflow-hidden shadow-lg w-3/4 max-w-7xl"
        }`}
      >
        {!isModal && (
          <SidePanel
            title={panel.title}
            subtitle={panel.subtitle}
            position={panel.position}
            showAppButtons={panel.showAppButtons}
            isVisible={panel.isVisible}
          />
        )}

        <FormPanel
          title={form.title}
          description={form.description}
          submitText={form.submitText}
          redirectLink={form.redirectLink}
          fields={form.fields}
          onSubmit={handleCreateWorkspace}
        />
      </div>
    </>
  );

  if (isModal) {
    return (
      <Modal isOpen={true} onClose={onClose}>
        {content}
      </Modal>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {content}
    </div>
  );
}
