import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { Modal } from "../base-component/modal";
import { Button } from "../base-component/Button";
import { Form, Field } from "react-final-form";
import { FieldWrapper } from "@/components/fields/FieldWrapper";
import { editCard, deleteCard } from "@/redux/thunks/cardThunks";
import { useToaster } from "@/components/base-component/toaster";

type BoardCardProps = {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  onClick?: (id: string) => void;
};

export function BoardCard({
  id,
  title,
  boardId,
  listId,
  onClick,
}: BoardCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast, confirm } = useToaster();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaveCard = async (values: { name: string }) => {
    if (!values.name.trim()) {
      toast("Card name cannot be empty", "error");
      
      return;
    }

    try {
      await dispatch(
        editCard({
          boardId,
          listId,
          cardId: id,
          updates: { name: values.name },
        })
      ).unwrap();

      toast(`Card "${values.name}" updated successfully`, "success");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to update card", err);
      toast("Failed to update card", "error");
    }
  };

  const handleDeleteCard = async () => {
    const confirmed = await confirm(
      `Delete card "${title}"? This action is permanent.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteCard({ boardId, listId, cardId: id })).unwrap();
      toast(`Card "${title}" deleted successfully`, "success");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to delete card", err);
      toast("Failed to delete card", "error");
    }
  };

  return (
    <>
      <div
        className="relative p-2 text-sm bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
        onClick={() => {
          if (onClick) {
            onClick(id);
          }
        }}
      >
        <span className="truncate">{title}</span>

        <MoreVertical
          className="w-4 h-4 text-gray-400 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
        />
      </div>

      {modalOpen && (
        <Modal isOpen={true} onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {title} Settings
          </h2>

          <Form
            onSubmit={handleSaveCard}
            initialValues={{ name: title }}
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
                      id="cardName"
                      name="cardName"
                      label="Card Name"
                    >
                      {() => (
                        <input
                          {...input}
                          placeholder="Card Name"
                          className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </FieldWrapper>
                  )}
                </Field>

                <div className="flex justify-between items-center mt-6">
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
                    onClick={handleDeleteCard}
                  >
                    Delete Card
                  </Button>
                </div>
              </form>
            )}
          />
        </Modal>
      )}
    </>
  );
}
