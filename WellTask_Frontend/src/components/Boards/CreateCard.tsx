import { useDispatch } from "react-redux";
import { Form } from "react-final-form";
import { Modal } from "@/components/base-component/modal";
import { Input } from "@/components/fields/Input";
import { Button } from "@/components/base-component/Button";
import type { AppDispatch } from "@/redux/store";
import { addCard } from "@/redux/thunks/cardThunks";
import { required } from "@/utils/validators";

interface CreateCardModalProps {
  boardId: string;
  listId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCard({
  boardId,
  listId,
  isOpen,
  onClose,
}: CreateCardModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateCard = async (values: { cardName: string }) => {
    const name = values.cardName?.trim();

    if (!name) {
      return;
    }

    const result = await dispatch(addCard({ boardId, listId, name }));

    if (addCard.rejected.match(result)) {
      console.error(result.payload);
    } else {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Create New Card</h3>

      <Form
        onSubmit={handleCreateCard}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="cardName"
              name="cardName"
              placeholder="Enter card name"
              fullWidth
              validate={required}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="custom"
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  onClose();
                }}
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
