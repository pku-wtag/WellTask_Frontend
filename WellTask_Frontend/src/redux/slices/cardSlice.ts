import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";

interface CardState {
  cards: Record<string, Card[]>;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialCards: Record<string, Card[]> = {};
const workspaces = getWorkspaces();

workspaces.forEach((ws) => {
  ws.boards.forEach((board) => {
    board.lists.forEach((list) => {
      initialCards[list.id] = list.cards || [];
    });
  });
});

const initialState: CardState = {
  cards: initialCards,
  isLoading: false,
  error: null,
  message: null,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.message = null;
    },

    setMessage: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },

    addCardToListState: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const { listId, card } = action.payload;
      const listCards = state.cards[listId] || [];
      state.cards[listId] = [...listCards, card];
    },

    updateCardInListState: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const { listId, card } = action.payload;
      const listCards = state.cards[listId];
      if (!listCards) return;
      state.cards[listId] = listCards.map((c) => (c.id === card.id ? card : c));
    },

    removeCardFromListState: (
      state,
      action: PayloadAction<{ listId: string; cardId: string }>
    ) => {
      const { listId, cardId } = action.payload;
      const listCards = state.cards[listId];
      if (!listCards) return;
      state.cards[listId] = listCards.filter((c) => c.id !== cardId);
    },

    addCardsToList: (
      state,
      action: PayloadAction<{ listId: string; cards: Card[] }>
    ) => {
      const { listId, cards } = action.payload;
      state.cards[listId] = cards;
    },
  },
});

export const {
  startLoading,
  setError,
  setMessage,
  clearError,
  clearMessage,
  addCardToListState,
  updateCardInListState,
  removeCardFromListState,
  addCardsToList,
} = cardSlice.actions;

export default cardSlice.reducer;
