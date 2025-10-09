import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { addCardToListState } from "../slices/cardSlice";

export const addCard = createAsyncThunk<
  { listId: string; card: Card }, 
  { listId: string; boardId: string; name: string }, 
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
      return { listId, card: newCard };
    } catch (err) {
      const msg = (err as Error).message || "Failed to add card";
      return rejectWithValue(msg);
    }
  }
);
