import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { setCurrentWorkspace } from "@/redux/slices/workspaceSlice";
import { useState } from "react";
import { Modal } from "@/components/base-component/modal";
import { Button } from "@/components/base-component/Button";
import { Form, Field } from "react-final-form";
import { FieldWrapper } from "@/components/fields/FieldWrapper";
import { editBoard, deleteBoard } from "@/redux/thunks/boardThunks";

interface BoardCardProps {
  id: string;
  name: string;
  workspaceId?: string;
  bgColor?: string;
}

export function BoardCard({
  id,
  name,
  workspaceId,
  bgColor = "bg-blue-100",
}: BoardCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const workspaces = useSelector(
    (state: RootState) => state.auth.user?.workspaces || []
  );

  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (workspaceId) {
      const workspace = workspaces.find((w) => w.id === workspaceId);
      if (workspace) {
        dispatch(setCurrentWorkspace(workspace));
      }
    }

    navigate(`/dashboard/board?id=${id}`, {
      state: { boardId: id, boardName: name },
    });
  };

  const handleSave = async (values: { name: string }) => {
    if (!workspaceId) {
      return;
    }

    if (!values.name.trim()) {
      alert("Board name cannot be empty");
      return;
    }

    try {
      await dispatch(
        editBoard({ workspaceId, boardId: id, updates: { name: values.name } })
      ).unwrap();

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to update board", err);
      alert("Failed to update board");
    }
  };

  const handleDelete = async () => {
    if (!workspaceId) {
      return;
    }

    const confirmed = confirm(
      `Delete board "${name}"? This action is permanent.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteBoard({ workspaceId, boardId: id })).unwrap();
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to delete board", err);
      alert("Failed to delete board");
    }
  };

  return (
    <>
      <div
        className={`${bgColor} p-4 rounded-lg hover:${bgColor.replace(
          "100",
          "200"
        )} cursor-pointer flex flex-col gap-2 relative`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-800 font-medium truncate">{name}</span>

          <MoreVertical
            className="w-5 h-5 text-gray-500 hover:text-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
          />
        </div>
      </div>

      {modalOpen && (
        <Modal isOpen={true} onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {name} Settings
          </h2>

          <Form
            onSubmit={handleSave}
            initialValues={{ name }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field name="name">
                  {({ input }) => (
                    <FieldWrapper
                      id="boardName"
                      name="boardName"
                      label="Board Name"
                    >
                      {() => (
                        <input
                          {...input}
                          placeholder="Board Name"
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
                    onClick={handleDelete}
                  >
                    Delete Board
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
