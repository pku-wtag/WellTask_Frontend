import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import { addCardToList, updateCardInList, removeCardFromList } from "../slices/cardSlice";
import { updateListInBoard } from "../slices/listSlice";
import { updateUser } from "../slices/authSlice";
import { setError, setMessage } from "../slices/cardSlice";

// ---------------- ADD CARD ----------------
export const addCard = createAsyncThunk<
  { boardId: string; listId: string; card: Card },
  { boardId: string; listId: string; name: string },
  { rejectValue: string }
>(
  "card/addCard",
  async ({ boardId, listId, name }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces.flatMap((ws) => ws.boards).find((b) => b.id === boardId);
      if (!board) {
        const msg = "Board not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const list = board.lists.find((l) => l.id === listId);
      if (!list) {
        const msg = "List not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const newCard: Card = { id: uuidv4(), name };
      list.cards.push(newCard);
      saveWorkspaces(workspaces);

      dispatch(addCardToList({ listId, card: newCard }));
      dispatch(updateListInBoard({ boardId, list }));

      const currentUser = getCurrentUser();
      if (currentUser) {
        currentUser.workspaces =
          currentUser.workspaces?.map((ws) => ({
            ...ws,
            boards: ws.boards.map((b) =>
              b.id === boardId ? { ...b, lists: b.lists.map((l) => (l.id === listId ? list : l)) } : b
            ),
          })) || [];
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      dispatch(setMessage("Card added successfully!"));
      return { boardId, listId, card: newCard };
    } catch (err) {
      const msg = (err as Error).message || "Failed to add card";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// ---------------- EDIT CARD ----------------
export const editCard = createAsyncThunk<
  { boardId: string; listId: string; card: Card },
  { boardId: string; listId: string; cardId: string; updates: Partial<Card> },
  { rejectValue: string }
>(
  "card/editCard",
  async ({ boardId, listId, cardId, updates }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces.flatMap((ws) => ws.boards).find((b) => b.id === boardId);
      if (!board) {
        const msg = "Board not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const list = board.lists.find((l) => l.id === listId);
      if (!list) {
        const msg = "List not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const index = list.cards.findIndex((c) => c.id === cardId);
      if (index === -1) {
        const msg = "Card not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const updated = { ...list.cards[index], ...updates };
      list.cards[index] = updated;
      saveWorkspaces(workspaces);

      dispatch(updateCardInList({ listId, card: updated }));
      dispatch(updateListInBoard({ boardId, list }));

      const currentUser = getCurrentUser();
      if (currentUser) {
        currentUser.workspaces =
          currentUser.workspaces?.map((ws) => ({
            ...ws,
            boards: ws.boards.map((b) =>
              b.id === boardId ? { ...b, lists: b.lists.map((l) => (l.id === listId ? list : l)) } : b
            ),
          })) || [];
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      dispatch(setMessage("Card updated successfully!"));
      return { boardId, listId, card: updated };
    } catch (err) {
      const msg = (err as Error).message || "Failed to update card";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// ---------------- DELETE CARD ----------------
export const deleteCard = createAsyncThunk<
  { boardId: string; listId: string; cardId: string },
  { boardId: string; listId: string; cardId: string },
  { rejectValue: string }
>(
  "card/deleteCard",
  async ({ boardId, listId, cardId }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces.flatMap((ws) => ws.boards).find((b) => b.id === boardId);
      if (!board) {
        const msg = "Board not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const list = board.lists.find((l) => l.id === listId);
      if (!list) {
        const msg = "List not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      list.cards = list.cards.filter((c) => c.id !== cardId);
      saveWorkspaces(workspaces);

      dispatch(removeCardFromList({ listId, cardId }));
      dispatch(updateListInBoard({ boardId, list }));

      const currentUser = getCurrentUser();
      if (currentUser) {
        currentUser.workspaces =
          currentUser.workspaces?.map((ws) => ({
            ...ws,
            boards: ws.boards.map((b) =>
              b.id === boardId ? { ...b, lists: b.lists.map((l) => (l.id === listId ? list : l)) } : b
            ),
          })) || [];
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      dispatch(setMessage("Card deleted successfully!"));
      return { boardId, listId, cardId };
    } catch (err) {
      const msg = (err as Error).message || "Failed to delete card";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);
