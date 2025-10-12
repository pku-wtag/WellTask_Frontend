import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { Button } from "../base-component/Button";
import { BoardList } from "./BoardList";
import { BoardNavbar } from "./BoardNavbar";
import { CreateList } from "./CreateList";
import type { Board } from "@/types/Workspace";
import { addList } from "@/redux/thunks/listThunks";

export default function Board() {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("id");

  const dispatch = useDispatch<AppDispatch>();
  const [isListModalOpen, setListModalOpen] = useState(false);

  const boardsState = useSelector((state: RootState) => state.board.boards);
  const listsState = useSelector((state: RootState) => state.list.lists);

  const board: Board | undefined = Object.values(boardsState)
    .flat()
    .find((b) => b.id === boardId);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Board not found.
      </div>
    );
  }

  const boardLists = boardId ? listsState[boardId] || [] : [];

  const handleAddList = async (name: string) => {
    if (!boardId) return;
    await dispatch(addList({ boardId, name }));
    setListModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <BoardNavbar name={board.name} />

      <div className="flex-1 overflow-x-auto px-4 py-4">
        <div className="flex items-start gap-4">
          {boardLists.map((list) => (
            <BoardList
              key={list.id}
              boardId={boardId!}
              listId={list.id}
              title={list.name}
              onMoreOptions={() => console.log("More options for", list.name)}
              onCardClick={(cardId) => console.log("Card clicked:", cardId)}
            />
          ))}

          <Button
            type="custom"
            className="w-72 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
            onClick={() => setListModalOpen(true)}
          >
            + Add another list
          </Button>
        </div>
      </div>

      {boardId && isListModalOpen && (
        <CreateList
          boardId={boardId}
          isOpen={isListModalOpen}
          onClose={() => setListModalOpen(false)}
          onCreate={handleAddList}
        />
      )}
    </div>
  );
}
