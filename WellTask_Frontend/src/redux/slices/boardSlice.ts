import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Board } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";

interface BoardState {
  boards: Record<string, Board[]>;
  currentBoard: Board | null;
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
  error: null,
  message: null,
};

const boardSlice = createSlice({
  name: "board",
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

    setCurrentBoard: (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload;
    },

    setBoardsForWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; boards: Board[] }>
    ) => {
      state.boards[action.payload.workspaceId] = action.payload.boards;
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

    updateBoard: (
      state,
      action: PayloadAction<{ workspaceId: string; board: Board }>
    ) => {
      const { workspaceId, board } = action.payload;
      state.boards[workspaceId] = state.boards[workspaceId].map((b) => {
        if (b.id === board.id) {
          return board;
        } else {
          return b;
        }
      });
      if (state.currentBoard?.id === board.id) {
        state.currentBoard = board;
      }
    },

    removeBoard: (
      state,
      action: PayloadAction<{ workspaceId: string; boardId: string }>
    ) => {
      const { workspaceId, boardId } = action.payload;
      state.boards[workspaceId] = state.boards[workspaceId].filter((b) => {
        return b.id !== boardId;
      });
      if (state.currentBoard?.id === boardId) {
        state.currentBoard = null;
      }
    },
  },
});

export const {
  setError,
  setMessage,
  clearError,
  clearMessage,
  setCurrentBoard,
  setBoardsForWorkspace,
  addBoardToWorkspace,
  updateBoard,
  removeBoard,
} = boardSlice.actions;

export default boardSlice.reducer;
