import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "../base-component/Button";
import { BoardList } from "./BoardList";
import { BoardNavbar } from "./BoardNavbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  type List as WorkspaceList,
  type Card as WorkspaceCard,
  updateWorkspace,
  type Workspace,
} from "@/redux/slices/workspaceSlice";
import { v4 as uuidv4 } from "uuid";

export default function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );

  const [lists, setLists] = useState<WorkspaceList[]>([]);
  const [boardName, setBoardName] = useState<string>("");
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const tempWorkspace: Workspace | undefined = location.state?.workspace;

  useEffect(() => {
    if (tempWorkspace) {
      const board = tempWorkspace.boards.find((b) => b.id === boardId);
      if (board) {
        setBoardName(board.name);
        setLists(board.lists);
        setWorkspaceId(tempWorkspace.id);
      }
    } else {
      for (const ws of workspaces) {
        const board = ws.boards.find((b) => b.id === boardId);
        if (board) {
          setBoardName(board.name);
          setLists(board.lists);
          setWorkspaceId(ws.id);
          break;
        }
      }
    }
  }, [boardId, workspaces, tempWorkspace]);

  const handleAddCard = (listId: string) => {
    const newCard: WorkspaceCard = { id: uuidv4(), name: "New Card" };
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
    );
    setLists(updatedLists);

    if (!tempWorkspace) {
      const workspace = workspaces.find((ws) => ws.id === workspaceId);
      if (workspace) {
        const boardIndex = workspace.boards.findIndex((b) => b.id === boardId);
        if (boardIndex > -1) {
          workspace.boards[boardIndex].lists = updatedLists;
          dispatch(updateWorkspace(workspace));
        }
      }
    }
  };

  if (!boardName)
    return <div className="p-6 text-gray-600">Board not found.</div>;

  return (
    <div className="flex flex-col h-full">
      <BoardNavbar name={boardName} />

      <div className="flex-1 overflow-x-auto px-4 py-4">
        <div className="flex items-start gap-4">
          {lists.map((list) => (
            <BoardList
              key={list.id}
              name={list.name}
              cards={list.cards.map((c) => ({ id: c.id, name: c.name }))}
              onAddCard={() => handleAddCard(list.id)}
              onMoreOptions={() => console.log("More options for", list.name)}
            />
          ))}

          <Button
            type="custom"
            className="w-72 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
            onClick={() => console.log("Add another list")}
          >
            + Add another list
          </Button>
        </div>
      </div>
    </div>
  );
}
