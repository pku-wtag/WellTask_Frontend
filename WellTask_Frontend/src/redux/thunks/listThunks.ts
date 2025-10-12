import { createAsyncThunk } from "@reduxjs/toolkit";
import type { List } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { addListToBoard } from "../slices/listSlice";
import { addListToUserBoard } from "../slices/authSlice";

export const addList = createAsyncThunk<
  { boardId: string; list: List },
  { boardId: string; name: string },
  { rejectValue: string }
>("list/addList", async ({ boardId, name }, { dispatch, rejectWithValue }) => {
  try {
    const workspaces = getWorkspaces();

    const board = workspaces
      .flatMap((ws) => ws.boards)
      .find((b) => b.id === boardId);
    if (!board) return rejectWithValue("Board not found");

    const newList: List = { id: uuidv4(), name, cards: [] };

    board.lists.push(newList);
    saveWorkspaces(workspaces);

    dispatch(addListToBoard({ boardId, list: newList }));
    dispatch(addListToUserBoard({ boardId, list: newList }));

    return { boardId, list: newList };
  } catch (err) {
    const msg = (err as Error).message || "Failed to add list";
    return rejectWithValue(msg);
  }
});
