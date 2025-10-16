import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  ChevronsRightLeft,
  ChevronsLeftRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Card } from "@/types/Workspace";

import { BoardCard } from "./BoardCard";
import { Button } from "../base-component/Button";
import { CreateCard } from "./CreateCard";
import { Modal } from "../base-component/Modal/modal";
import { Form, Field } from "react-final-form";
import { FieldWrapper } from "@/components/fields/FieldWrapper";
import { editList, deleteList } from "@/redux/thunks/listThunks";
import { useToaster } from "@/components/base-component/toaster";
import { Droppable, Draggable } from "@hello-pangea/dnd";

type ListProps = {
  boardId: string;
  listId: string;
  title: string;
  onCardClick?: (id: string) => void;
};

export function BoardList({ boardId, listId, title, onCardClick }: ListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast, confirm } = useToaster();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateCardOpen, setCreateCardOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const cards: Card[] = useSelector(
    (state: RootState) => state.card.cards[listId] || []
  );

  const handleAddCard = () => setCreateCardOpen(true);

  const handleSaveList = async (values: { name: string }) => {
    if (!values.name.trim()) {
      toast("List name cannot be empty", "error");
      return;
    }
    try {
      await dispatch(
        editList({ boardId, listId, updates: { name: values.name } })
      ).unwrap();
      toast(`List "${values.name}" updated successfully`, "success");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to update list", err);
      toast("Failed to update list", "error");
    }
  };

  const handleDeleteList = async () => {
    const confirmed = await confirm(
      `Delete list "${title}"? This action is permanent.`
    );
    if (!confirmed) return;
    try {
      await dispatch(deleteList({ boardId, listId })).unwrap();
      toast(`List "${title}" deleted successfully`, "success");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to delete list", err);
      toast("Failed to delete list", "error");
    }
  };

  if (isCollapsed) {
    return (
      <div
        onClick={() => setIsCollapsed(false)}
        className="flex-shrink-0 w-14 bg-gray-50 rounded-lg shadow-sm border border-gray-200 py-4 px-2 cursor-pointer flex flex-col items-center justify-start hover:bg-gray-100 transition-colors"
      >
        <ChevronsLeftRight className="w-5 h-5 text-gray-500 shrink-0" />
        <h2 className="mt-4 text-sm font-semibold text-gray-800 [writing-mode:vertical-rl] transform rotate-180 whitespace-nowrap">
          {title}
        </h2>
      </div>
    );
  }

  return (
    <>
      <Droppable droppableId={listId} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-shrink-0 w-72 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col`}
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <div className="flex items-center justify-between px-3 py-2 shrink-0">
              <h2 className="text-sm font-semibold text-gray-800 truncate">
                {title}
              </h2>
              <div className="flex items-center gap-1">
                <MoreHorizontal
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setModalOpen(true)}
                />
                <ChevronsRightLeft
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setIsCollapsed(true)}
                />
              </div>
            </div>

            <div
              className={`px-3 py-1 space-y-2 flex-1 overflow-y-auto ${
                snapshot.isDraggingOver ? "bg-blue-50" : ""
              }`}
              style={{ maxHeight: "calc(100vh - 300px)" }}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BoardCard
                        id={card.id}
                        boardId={boardId}
                        listId={listId}
                        title={card.name}
                        color={card.color || "#ffffff"}
                        onClick={onCardClick}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>

            <Button
              type="custom"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-b-lg shrink-0"
              onClick={handleAddCard}
            >
              <Plus className="w-4 h-4" /> Add a card
            </Button>
          </div>
        )}
      </Droppable>

      <CreateCard
        boardId={boardId}
        listId={listId}
        isOpen={isCreateCardOpen}
        onClose={() => setCreateCardOpen(false)}
      />

      {modalOpen && (
        <Modal isOpen={true} onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {title} Settings
          </h2>
          <Form
            onSubmit={handleSaveList}
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
                      id="listName"
                      name="listName"
                      label="List Name"
                    >
                      {() => (
                        <input
                          {...input}
                          placeholder="List Name"
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
                    onClick={handleDeleteList}
                  >
                    Delete List
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
