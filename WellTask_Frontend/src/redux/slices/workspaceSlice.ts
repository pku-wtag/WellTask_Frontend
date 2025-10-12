import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Workspace } from "@/types/Workspace";

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
  message: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
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
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
  },
});

export const {
  startLoading,
  setError,
  setMessage,
  clearError,
  clearMessage,
  setCurrentWorkspace,
  setWorkspaces,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
