import { Button } from "@/components/base-component/Button";
import { Modal } from "@/components/base-component/modal";
import { Input } from "@/components/fields/Input";
import { Form } from "react-final-form";
import type { AppDispatch } from "@/redux/store";
import { addBoard } from "@/redux/thunks/boardThunks";
import { useDispatch } from "react-redux";

interface CreateBoardModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBoard({
  workspaceId,
  isOpen,
  onClose,
}: CreateBoardModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateBoard = async (values: { boardName: string }) => {
    const name = values.boardName?.trim();

    if (!name) {
      return;
    }

    try {
      await dispatch(addBoard({ workspaceId, name })).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to create board", err);
      alert("Failed to create board");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Create New Board</h3>

      <Form
        onSubmit={handleCreateBoard}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="boardName"
              name="boardName"
              placeholder="Enter board name"
              fullWidth
              validate={(value) => {
                if (!value) {
                  return "Board name is required";
                } else {
                  return undefined;
                }
              }}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="custom"
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                type="custom"
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                htmlType="submit"
              >
                Create
              </Button>
            </div>
          </form>
        )}
      />
    </Modal>
  );
}
