import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Board } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";

interface BoardState {
  boards: Record<string, Board[]>;
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialBoards: Record<string, Board[]> = {};
const workspaces = getWorkspaces();
workspaces.forEach((ws) => {
  initialBoards[ws.id] = ws.boards;
});

const initialState: BoardState = {
  boards: initialBoards,
  currentBoard: null,
  isLoading: false,
  error: null,
  message: null,
};

const boardSlice = createSlice({
  name: "board",
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
    setCurrentBoard: (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload;
    },
    addBoardToWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; board: Board }>
    ) => {
      const workspaceBoards = state.boards[action.payload.workspaceId] || [];
      state.boards[action.payload.workspaceId] = [
        ...workspaceBoards,
        action.payload.board,
      ];
    },
  },
});

export const {
  startLoading,
  setError,
  setMessage,
  clearError,
  clearMessage,
  setCurrentBoard,
  addBoardToWorkspace,
} = boardSlice.actions;

export default boardSlice.reducer;
