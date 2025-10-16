import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Workspace } from "@/types/Workspace";

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  error: string | null;
  message: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  error: null,
  message: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
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

    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },

    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },

    updateWorkspace: (state, action: PayloadAction<Workspace>) => {
      const updated = action.payload;

      state.workspaces = state.workspaces.map((ws) =>
        ws.id === updated.id ? updated : ws
      );

      if (state.currentWorkspace?.id === updated.id) {
        state.currentWorkspace = updated;
      }
    },

    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter(
        (ws) => ws.id !== action.payload
      );

      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = null;
      }
    },
  },
});

export const {
  setError,
  setMessage,
  clearError,
  clearMessage,
  setCurrentWorkspace,
  setWorkspaces,
  updateWorkspace,
  removeWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
