import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import {
  addCardToListState,
  updateCardInListState,
  removeCardFromListState,
} from "../slices/cardSlice";
import { addCardToList, updateListInBoard } from "../slices/listSlice";
import { updateUser } from "../slices/authSlice";

export const addCard = createAsyncThunk<
  { listId: string; card: Card },
  { boardId: string; listId: string; name: string },
  { rejectValue: string }
>(
  "card/addCard",
  async ({ boardId, listId, name }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) return rejectWithValue("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) return rejectWithValue("List not found");

      const newCard: Card = { id: uuidv4(), name };
      list.cards.push(newCard);
      saveWorkspaces(workspaces);

      dispatch(addCardToListState({ listId, card: newCard }));
      dispatch(addCardToList({ boardId, listId, card: newCard }));

      const currentUser = getCurrentUser();
      if (currentUser?.workspaces) {
        currentUser.workspaces = currentUser.workspaces.map((ws) => ({
          ...ws,
          boards: ws.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  lists: b.lists.map((l) => (l.id === listId ? list : l)),
                }
              : b
          ),
        }));
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      return { listId, card: newCard };
    } catch (err) {
      const msg = (err as Error).message || "Failed to add card";
      return rejectWithValue(msg);
    }
  }
);

export const editCard = createAsyncThunk<
  { listId: string; card: Card },
  { boardId: string; listId: string; cardId: string; updates: Partial<Card> },
  { rejectValue: string }
>(
  "card/editCard",
  async (
    { boardId, listId, cardId, updates },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) throw new Error("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) throw new Error("List not found");

      const index = list.cards.findIndex((c) => c.id === cardId);
      if (index === -1) throw new Error("Card not found");

      const updated = { ...list.cards[index], ...updates };
      list.cards[index] = updated;
      saveWorkspaces(workspaces);

      dispatch(updateCardInListState({ listId, card: updated }));
      dispatch(updateListInBoard({ boardId, list }));

      const currentUser = getCurrentUser();
      if (currentUser?.workspaces) {
        currentUser.workspaces = currentUser.workspaces.map((ws) => ({
          ...ws,
          boards: ws.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  lists: b.lists.map((l) => (l.id === listId ? list : l)),
                }
              : b
          ),
        }));
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      return { listId, card: updated };
    } catch (err) {
      const msg = (err as Error).message || "Failed to update card";
      return rejectWithValue(msg);
    }
  }
);

export const deleteCard = createAsyncThunk<
  { listId: string; cardId: string },
  { boardId: string; listId: string; cardId: string },
  { rejectValue: string }
>(
  "card/deleteCard",
  async ({ boardId, listId, cardId }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) throw new Error("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) throw new Error("List not found");

      list.cards = list.cards.filter((c) => c.id !== cardId);
      saveWorkspaces(workspaces);

      dispatch(removeCardFromListState({ listId, cardId }));
      dispatch(updateListInBoard({ boardId, list }));

      const currentUser = getCurrentUser();
      if (currentUser?.workspaces) {
        currentUser.workspaces = currentUser.workspaces.map((ws) => ({
          ...ws,
          boards: ws.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  lists: b.lists.map((l) => (l.id === listId ? list : l)),
                }
              : b
          ),
        }));
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      return { listId, cardId };
    } catch (err) {
      const msg = (err as Error).message || "Failed to delete card";
      return rejectWithValue(msg);
    }
  }
);
