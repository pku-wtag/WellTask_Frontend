import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";
import { getColorByStatus } from "@/utils/statusColor";

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
      state.cards[action.payload.listId] = [...action.payload.cards];
    },

    addCardToList: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const { listId, card } = action.payload;
      state.cards[listId] = [...(state.cards[listId] || []), card];
    },

    updateCardInList: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const { listId, card } = action.payload;
      const listCards = state.cards[listId];
      if (!listCards) return;
      state.cards[listId] = listCards.map((c) => (c.id === card.id ? card : c));
    },

    removeCardFromList: (
      state,
      action: PayloadAction<{ listId: string; cardId: string }>
    ) => {
      const { listId, cardId } = action.payload;
      const listCards = state.cards[listId];
      if (!listCards) return;
      state.cards[listId] = listCards.filter((c) => c.id !== cardId);
    },

    moveCardBetweenLists: (
      state,
      action: PayloadAction<{
        sourceListId: string;
        destListId: string;
        sourceIndex: number;
        destIndex: number;
        destListName: string;
      }>
    ) => {
      const { sourceListId, destListId, sourceIndex, destIndex, destListName } =
        action.payload;

      const sourceCards = [...(state.cards[sourceListId] || [])];
      const destCards =
        sourceListId === destListId
          ? sourceCards
          : [...(state.cards[destListId] || [])];

      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      if (!movedCard) return;

      if (sourceListId !== destListId) {
        movedCard.status = destListName;
        movedCard.color = getColorByStatus(destListName);
      }
      movedCard.updatedAt = new Date().toISOString();

      destCards.splice(destIndex, 0, movedCard);

      state.cards[sourceListId] =
        sourceListId === destListId ? destCards : sourceCards;
      state.cards[destListId] = destCards;
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
  moveCardBetweenLists,
} = cardSlice.actions;

export default cardSlice.reducer;
