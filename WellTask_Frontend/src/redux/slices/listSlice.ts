import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { List, Card } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";

interface ListState {
  lists: Record<string, List[]>;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialLists: Record<string, List[]> = {};
const workspaces = getWorkspaces();
workspaces.forEach((ws) => {
  ws.boards.forEach((board) => {
    initialLists[board.id] = board.lists || [];
  });
});

const initialState: ListState = {
  lists: initialLists,
  isLoading: false,
  error: null,
  message: null,
};

const listSlice = createSlice({
  name: "list",
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
    addListToBoard: (
      state,
      action: PayloadAction<{ boardId: string; list: List }>
    ) => {
      const { boardId, list } = action.payload;
      const boardLists = state.lists[boardId] || [];
      state.lists[boardId] = [...boardLists, list];
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
        targetList.cards = [...(targetList.cards || []), card];
      }
    },
  },
});

export const {
  startLoading,
  setError,
  setMessage,
  clearError,
  clearMessage,
  addListToBoard,
  addCardToList,
} = listSlice.actions;

export default listSlice.reducer;
