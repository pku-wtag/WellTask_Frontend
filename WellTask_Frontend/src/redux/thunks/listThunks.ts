import { createAsyncThunk } from "@reduxjs/toolkit";
import type { List } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import {
  addListToBoard,
  updateListInBoard,
  removeListFromBoard,
  setError,
  setMessage,
} from "../slices/listSlice";
import { updateUser } from "../slices/authSlice";

// ---------------- ADD LIST ----------------
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

    if (!board) {
      const msg = "Board not found";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }

    const newList: List = { id: uuidv4(), name, cards: [] };
    board.lists.push(newList);
    saveWorkspaces(workspaces);

    const user = getCurrentUser();
    if (user) {
      user.workspaces =
        user.workspaces?.map((w) =>
          w.boards.some((b) => b.id === boardId)
            ? {
                ...w,
                boards: w.boards.map((b) => (b.id === boardId ? board : b)),
              }
            : w
        ) || [];
      saveUser(user);
      dispatch(updateUser({ workspaces: user.workspaces }));
    }

    dispatch(addListToBoard({ boardId, list: newList }));
    dispatch(setMessage("List added successfully!"));

    return { boardId, list: newList };
  } catch (err) {
    const msg = (err as Error).message || "Failed to add list";
    dispatch(setError(msg));
    return rejectWithValue(msg);
  }
});

// ---------------- EDIT LIST ----------------
export const editList = createAsyncThunk<
  { boardId: string; list: List },
  { boardId: string; listId: string; updates: Partial<List> },
  { rejectValue: string }
>(
  "list/editList",
  async ({ boardId, listId, updates }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);

      if (!board) {
        const msg = "Board not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const index = board.lists.findIndex((l) => l.id === listId);
      if (index === -1) {
        const msg = "List not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const updated = { ...board.lists[index], ...updates };
      board.lists[index] = updated;
      saveWorkspaces(workspaces);

      const user = getCurrentUser();
      if (user) {
        user.workspaces =
          user.workspaces?.map((w) =>
            w.boards.some((b) => b.id === boardId)
              ? {
                  ...w,
                  boards: w.boards.map((b) => (b.id === boardId ? board : b)),
                }
              : w
          ) || [];
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(updateListInBoard({ boardId, list: updated }));
      dispatch(setMessage("List updated successfully!"));

      return { boardId, list: updated };
    } catch (err) {
      const msg = (err as Error).message || "Failed to update list";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// ---------------- DELETE LIST ----------------
export const deleteList = createAsyncThunk<
  { boardId: string; listId: string },
  { boardId: string; listId: string },
  { rejectValue: string }
>(
  "list/deleteList",
  async ({ boardId, listId }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);

      if (!board) {
        const msg = "Board not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      board.lists = board.lists.filter((l) => l.id !== listId);
      saveWorkspaces(workspaces);

      const user = getCurrentUser();
      if (user) {
        user.workspaces =
          user.workspaces?.map((w) =>
            w.boards.some((b) => b.id === boardId)
              ? {
                  ...w,
                  boards: w.boards.map((b) => (b.id === boardId ? board : b)),
                }
              : w
          ) || [];
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(removeListFromBoard({ boardId, listId }));
      dispatch(setMessage("List deleted successfully!"));

      return { boardId, listId };
    } catch (err) {
      const msg = (err as Error).message || "Failed to delete list";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);
