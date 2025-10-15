import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";

interface CardState {
  cards: Record<string, Card[]>;
  error: string | null;
  message: string | null;
}

const initialCards: Record<string, Card[]> = {};
const workspaces = getWorkspaces() ?? [];

workspaces.forEach((ws) => {
  ws.boards.forEach((board) => {
    board.lists.forEach((list) => {
      initialCards[list.id] = list.cards || [];
    });
  });
});

const initialState: CardState = {
  cards: initialCards,
  error: null,
  message: null,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.message = null;
    },

    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },

    setCardsForList: (
      state,
      action: PayloadAction<{ listId: string; cards: Card[] }>
    ) => {
      state.cards[action.payload.listId] = action.payload.cards;
    },

    addCardToList: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const { listId, card } = action.payload;

      if (!state.cards[listId]) {
        state.cards[listId] = [];
      }

      state.cards[listId].push(card);
    },

    updateCardInList: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const { listId, card } = action.payload;
      const listCards = state.cards[listId];

      if (!listCards) {
        return;
      }

      state.cards[listId] = listCards.map((c) => (c.id === card.id ? card : c));
    },

    removeCardFromList: (
      state,
      action: PayloadAction<{ listId: string; cardId: string }>
    ) => {
      const { listId, cardId } = action.payload;
      const listCards = state.cards[listId];

      if (!listCards) {
        return;
      }

      state.cards[listId] = listCards.filter((c) => c.id !== cardId);
    },
  },
});

export const {
  setError,
  setMessage,
  clearError,
  clearMessage,
  setCardsForList,
  addCardToList,
  updateCardInList,
  removeCardFromList,
} = cardSlice.actions;

export default cardSlice.reducer;
