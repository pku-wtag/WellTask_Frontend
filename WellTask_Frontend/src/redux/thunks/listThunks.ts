import { createAsyncThunk } from "@reduxjs/toolkit";
import type { List, Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import {
  addListToBoard,
  updateListInBoard,
  removeListFromBoard,
  addCardToList,
} from "../slices/listSlice";
import { updateUser } from "../slices/authSlice";

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

    const user = getCurrentUser();
    if (user) {
      user.workspaces = user.workspaces?.map((w) =>
        w.boards.some((b) => b.id === boardId)
          ? {
              ...w,
              boards: w.boards.map((b) => (b.id === boardId ? board : b)),
            }
          : w
      );
      saveUser(user);
      dispatch(updateUser({ workspaces: user.workspaces }));
    }

    dispatch(addListToBoard({ boardId, list: newList }));
    return { boardId, list: newList };
  } catch (err) {
    const msg = (err as Error).message || "Failed to add list";
    return rejectWithValue(msg);
  }
});

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
      if (!board) throw new Error("Board not found");

      const index = board.lists.findIndex((l) => l.id === listId);
      if (index === -1) throw new Error("List not found");

      const updated = { ...board.lists[index], ...updates };
      board.lists[index] = updated;
      saveWorkspaces(workspaces);

      const user = getCurrentUser();
      if (user) {
        user.workspaces = user.workspaces?.map((w) =>
          w.boards.some((b) => b.id === boardId)
            ? {
                ...w,
                boards: w.boards.map((b) => (b.id === boardId ? board : b)),
              }
            : w
        );
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(updateListInBoard({ boardId, list: updated }));
      return { boardId, list: updated };
    } catch (err) {
      const msg = (err as Error).message || "Failed to update list";
      return rejectWithValue(msg);
    }
  }
);

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
      if (!board) throw new Error("Board not found");

      board.lists = board.lists.filter((l) => l.id !== listId);
      saveWorkspaces(workspaces);

      const user = getCurrentUser();
      if (user) {
        user.workspaces = user.workspaces?.map((w) =>
          w.boards.some((b) => b.id === boardId)
            ? {
                ...w,
                boards: w.boards.map((b) => (b.id === boardId ? board : b)),
              }
            : w
        );
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(removeListFromBoard({ boardId, listId }));
      return { boardId, listId };
    } catch (err) {
      const msg = (err as Error).message || "Failed to delete list";
      return rejectWithValue(msg);
    }
  }
);

export const addCard = createAsyncThunk<
  { boardId: string; listId: string; card: Card },
  { boardId: string; listId: string; name: string },
  { rejectValue: string }
>(
  "list/addCard",
  async ({ boardId, listId, name }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) throw new Error("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) throw new Error("List not found");

      const newCard: Card = { id: uuidv4(), name, description: "" };
      list.cards.push(newCard);
      saveWorkspaces(workspaces);

      const user = getCurrentUser();
      if (user) {
        user.workspaces = user.workspaces?.map((w) =>
          w.boards.some((b) => b.id === boardId)
            ? {
                ...w,
                boards: w.boards.map((b) => (b.id === boardId ? board : b)),
              }
            : w
        );
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(addCardToList({ boardId, listId, card: newCard }));
      return { boardId, listId, card: newCard };
    } catch (err) {
      const msg = (err as Error).message || "Failed to add card";
      return rejectWithValue(msg);
    }
  }
);
