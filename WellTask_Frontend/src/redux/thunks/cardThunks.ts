import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import {
  addCardToList,
  updateCardInList,
  removeCardFromList,
  setError,
  setMessage,
  moveCardBetweenLists,
} from "../slices/cardSlice";
import { updateListInBoard } from "../slices/listSlice";
import { updateUser } from "../slices/authSlice";
import { getColorByStatus } from "@/utils/statusColor";

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
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) return rejectWithValue("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) return rejectWithValue("List not found");

      const newCard: Card = {
        id: uuidv4(),
        name,
        status: list.name,
        color: getColorByStatus(list.name),
        createdAt: new Date().toISOString(),
      };

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
              b.id === boardId
                ? {
                    ...b,
                    lists: b.lists.map((l) => (l.id === listId ? list : l)),
                  }
                : b
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
  async (
    { boardId, listId, cardId, updates },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) return rejectWithValue("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) return rejectWithValue("List not found");

      const index = list.cards.findIndex((c) => c.id === cardId);
      if (index === -1) return rejectWithValue("Card not found");

      const updated: Card = {
        ...list.cards[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
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
              b.id === boardId
                ? {
                    ...b,
                    lists: b.lists.map((l) => (l.id === listId ? list : l)),
                  }
                : b
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
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) return rejectWithValue("Board not found");

      const list = board.lists.find((l) => l.id === listId);
      if (!list) return rejectWithValue("List not found");

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
              b.id === boardId
                ? {
                    ...b,
                    lists: b.lists.map((l) => (l.id === listId ? list : l)),
                  }
                : b
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

// ---------------- MOVE CARD ----------------
export const moveCard = createAsyncThunk<
  {
    boardId: string;
    sourceListId: string;
    destListId: string;
    cardId: string;
    sourceIndex: number;
    destIndex: number;
    destListName: string;
  },
  {
    boardId: string;
    sourceListId: string;
    destListId: string;
    sourceIndex: number;
    destIndex: number;
  },
  { rejectValue: string }
>(
  "card/moveCard",
  async (
    { boardId, sourceListId, destListId, sourceIndex, destIndex },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const workspaces = getWorkspaces();
      const board = workspaces
        .flatMap((ws) => ws.boards)
        .find((b) => b.id === boardId);
      if (!board) return rejectWithValue("Board not found");

      const sourceList = board.lists.find((l) => l.id === sourceListId);
      const destList = board.lists.find((l) => l.id === destListId);
      if (!sourceList || !destList) return rejectWithValue("List not found");

      const sourceCards = [...sourceList.cards];
      const destCards =
        sourceListId === destListId ? sourceCards : [...destList.cards];

      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      if (!movedCard) return rejectWithValue("Card not found");

      // Update card status and color based on destination list NAME
      if (sourceListId !== destListId) {
        movedCard.status = destList.name;
        movedCard.color = getColorByStatus(destList.name);
      }
      movedCard.updatedAt = new Date().toISOString();

      destCards.splice(destIndex, 0, movedCard);

      // Dispatch the Redux action with destination list name
      dispatch(
        moveCardBetweenLists({
          sourceListId,
          destListId,
          sourceIndex,
          destIndex,
          destListName: destList.name,
        })
      );

      sourceList.cards = sourceCards;
      destList.cards = destCards;
      saveWorkspaces(workspaces);

      const currentUser = getCurrentUser();
      if (currentUser) {
        currentUser.workspaces =
          currentUser.workspaces?.map((ws) => ({
            ...ws,
            boards: ws.boards.map((b) =>
              b.id === boardId
                ? {
                    ...b,
                    lists: b.lists.map((l) =>
                      l.id === sourceListId
                        ? sourceList
                        : l.id === destListId
                        ? destList
                        : l
                    ),
                  }
                : b
            ),
          })) || [];
        saveUser(currentUser);
        dispatch(updateUser({ workspaces: currentUser.workspaces }));
      }

      dispatch(setMessage("Card moved successfully!"));
      return {
        boardId,
        sourceListId,
        destListId,
        cardId: movedCard.id,
        sourceIndex,
        destIndex,
        destListName: destList.name,
      };
    } catch (err) {
      const msg = (err as Error).message || "Failed to move card";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);
