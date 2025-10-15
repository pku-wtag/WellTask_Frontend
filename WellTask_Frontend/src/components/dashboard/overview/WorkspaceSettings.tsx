import { useDispatch } from "react-redux";
import type { Workspace } from "@/types/Workspace";
import type { AppDispatch } from "@/redux/store";
import { Button } from "@/components/base-component/Button";
import { FieldWrapper } from "@/components/fields/FieldWrapper";
import { deleteWorkspace, editWorkspace } from "@/redux/thunks/workspaceThunks";
import { Form, Field } from "react-final-form";
import { Modal } from "@/components/base-component/modal";
import { useToaster } from "@/components/base-component/toaster";

interface WorkspaceSettingsModalProps {
  workspace: Workspace;
  onClose: () => void;
}

interface WorkspaceFormValues {
  name: string;
  type: string;
  description: string;
}

const workspaceTypes = [
  { value: "", label: "Select type" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "engineering-it", label: "Engineering/IT" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "personal", label: "Personal" },
  { value: "sales-crm", label: "Sales/CRM" },
  { value: "other", label: "Other" },
];

export function WorkspaceSettings({
  workspace,
  onClose,
}: WorkspaceSettingsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast, confirm } = useToaster();

  const handleDelete = async () => {
    const confirmed = await confirm(
      `Delete workspace "${workspace.name}"? This action is permanent.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteWorkspace(workspace.id)).unwrap();
      toast("Workspace deleted successfully", "success");

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to delete workspace", err);
      toast("Failed to delete workspace", "error");
    }
  };

  const handleSave = async (values: WorkspaceFormValues) => {
    if (!values.name.trim()) {
      toast("Workspace name cannot be empty", "error");
      
      return;
    }

    try {
      await dispatch(
        editWorkspace({ id: workspace.id, updates: values })
      ).unwrap();
      toast("Workspace updated successfully", "success");

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to update workspace", err);
      toast("Failed to update workspace", "error");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Workspace Settings
      </h2>

      <Form<WorkspaceFormValues>
        onSubmit={handleSave}
        initialValues={{
          name: workspace.name,
          type: workspace.type,
          description: workspace.description || "",
        }}
        render={({ handleSubmit }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="space-y-4"
          >
            <Field name="name">
              {({ input }) => (
                <FieldWrapper
                  id="workspaceName"
                  name="workspaceName"
                  label="Workspace Name"
                >
                  {() => (
                    <input
                      {...input}
                      placeholder="Workspace Name"
                      className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </FieldWrapper>
              )}
            </Field>

            <Field name="type">
              {({ input }) => (
                <FieldWrapper
                  id="workspaceType"
                  name="workspaceType"
                  label="Workspace Type"
                >
                  {() => (
                    <select
                      {...input}
                      className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {workspaceTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </FieldWrapper>
              )}
            </Field>

            <Field name="description">
              {({ input }) => (
                <FieldWrapper
                  id="workspaceDescription"
                  name="workspaceDescription"
                  label="Description"
                >
                  {() => (
                    <textarea
                      {...input}
                      placeholder="Description (optional)"
                      className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  )}
                </FieldWrapper>
              )}
            </Field>

            <div className="mt-6 flex justify-between items-center">
              <Button
                htmlType="submit"
                type="custom"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
              >
                Save Changes
              </Button>

              <Button
                type="custom"
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
                onClick={handleDelete}
              >
                Delete Workspace
              </Button>
            </div>
          </form>
        )}
      />
    </Modal>
  );
}
