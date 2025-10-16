import { Modal } from "@/components/base-component/modal";
import { Input } from "@/components/fields/Input";
import { Form } from "react-final-form";
import { required } from "@/utils/validators";

interface CreateListModalProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void | Promise<void>;
}

export function CreateList({
  isOpen,
  onClose,
  onCreate,
}: CreateListModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Create New List</h3>

      <Form
        onSubmit={(values) => {
          if (values.listName) {
            onCreate(values.listName);
          }
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="listName"
              name="listName"
              placeholder="Enter list name"
              fullWidth
              validate={required}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </form>
        )}
      />
    </Modal>
  );
}
