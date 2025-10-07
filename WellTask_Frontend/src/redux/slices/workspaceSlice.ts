import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Workspace } from "@/types/Workspace";

interface WorkspaceState {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
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
      state.error = null;
      state.message = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const { startLoading, setError, setMessage, clearError, clearMessage } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
