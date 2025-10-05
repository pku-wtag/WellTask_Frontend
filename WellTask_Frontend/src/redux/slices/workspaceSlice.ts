import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Workspace {
  name: string;
  type: string;
  description?: string;
}

interface WorkspaceState {
  workspace: Workspace | null;
}

const savedWorkspace = localStorage.getItem("workspace");

const initialState: WorkspaceState = {
  workspace: savedWorkspace ? JSON.parse(savedWorkspace) : null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.workspace = action.payload;
      localStorage.setItem("workspace", JSON.stringify(action.payload));
    },
    updateWorkspace: (state, action: PayloadAction<Partial<Workspace>>) => {
      if (state.workspace) {
        state.workspace = { ...state.workspace, ...action.payload };
        localStorage.setItem("workspace", JSON.stringify(state.workspace));
      }
    },
    clearWorkspace: (state) => {
      state.workspace = null;
      localStorage.removeItem("workspace");
    },
  },
});

export const { setWorkspace, updateWorkspace, clearWorkspace } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;
