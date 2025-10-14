import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { List, Card } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";

interface ListState {
  lists: Record<string, List[]>;
  error: string | null;
  message: string | null;
}

const initialLists: Record<string, List[]> = {};
const workspaces = getWorkspaces() ?? [];
workspaces.forEach((ws) => {
  ws.boards.forEach((board) => {
    initialLists[board.id] = board.lists || [];
  });
});

const initialState: ListState = {
  lists: initialLists,
  error: null,
  message: null,
};

const listSlice = createSlice({
  name: "list",
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

    setListsForBoard: (
      state,
      action: PayloadAction<{ boardId: string; lists: List[] }>
    ) => {
      state.lists[action.payload.boardId] = action.payload.lists;
    },

    addListToBoard: (
      state,
      action: PayloadAction<{ boardId: string; list: List }>
    ) => {
      const { boardId, list } = action.payload;
      if (!state.lists[boardId]) {
        state.lists[boardId] = [];
      }
      state.lists[boardId].push(list);
    },

    addCardToList: (
      state,
      action: PayloadAction<{ boardId: string; listId: string; card: Card }>
    ) => {
      const { boardId, listId, card } = action.payload;
      const boardLists = state.lists[boardId];
      if (!boardLists) return;

      const targetList = boardLists.find((l) => l.id === listId);
      if (targetList) {
        if (!targetList.cards) targetList.cards = [];
        targetList.cards.push(card);
      }
    },

    updateListInBoard: (
      state,
      action: PayloadAction<{ boardId: string; list: List }>
    ) => {
      const { boardId, list } = action.payload;
      const boardLists = state.lists[boardId];
      if (!boardLists) return;

      state.lists[boardId] = boardLists.map((l) =>
        l.id === list.id ? list : l
      );
    },

    removeListFromBoard: (
      state,
      action: PayloadAction<{ boardId: string; listId: string }>
    ) => {
      const { boardId, listId } = action.payload;
      const boardLists = state.lists[boardId];
      if (!boardLists) return;

      state.lists[boardId] = boardLists.filter((l) => l.id !== listId);
    },
  },
});

export const {
  setError,
  setMessage,
  clearError,
  clearMessage,
  setListsForBoard,
  addListToBoard,
  addCardToList,
  updateListInBoard,
  removeListFromBoard,
} = listSlice.actions;

export default listSlice.reducer;
