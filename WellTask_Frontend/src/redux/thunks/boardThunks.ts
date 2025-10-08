import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Board, List } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { addBoardToWorkspace } from "../slices/boardSlice";

export const addBoard = createAsyncThunk<
  { workspaceId: string; board: Board },
  { workspaceId: string; name: string },
  { rejectValue: string }
>(
  "board/addBoard",
  async ({ workspaceId, name }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const workspace = workspaces.find((w) => w.id === workspaceId);
      if (!workspace) throw new Error("Workspace not found");

      const newBoard: Board = {
        id: uuidv4(),
        name,
        starred: false,
        lists: [
          { id: uuidv4(), name: "Backlog", cards: [] } as List,
          { id: uuidv4(), name: "In Progress", cards: [] } as List,
          { id: uuidv4(), name: "Done", cards: [] } as List,
        ],
      };

      workspace.boards.push(newBoard);
      saveWorkspaces(workspaces);
      dispatch(addBoardToWorkspace({ workspaceId, board: newBoard }));

      return { workspaceId, board: newBoard };
    } catch (err) {
      const msg = (err as Error).message || "Failed to create board";
      return rejectWithValue(msg);
    }
  }
);
