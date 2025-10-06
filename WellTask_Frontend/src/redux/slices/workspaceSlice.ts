import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  id: string;
  name: string;
  description?: string;
}

export interface List {
  id: string;
  name: string;
  cards: Card[];
}

export interface Board {
  id: string;
  name: string;
  starred?: boolean;
  lists: List[];
}

export interface Workspace {
  id: string;
  name: string;
  type: string;
  description?: string;
  boards: Board[];
}

interface WorkspaceState {
  workspaces: Workspace[];
}

const savedWorkspaces = localStorage.getItem("workspaces");

const initialState: WorkspaceState = {
  workspaces: savedWorkspaces ? JSON.parse(savedWorkspaces) : [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.workspaces.push(action.payload);
      localStorage.setItem("workspaces", JSON.stringify(state.workspaces));
    },
    updateWorkspace: (state, action: PayloadAction<Workspace>) => {
      const index = state.workspaces.findIndex(
        (w) => w.id === action.payload.id
      );
      if (index > -1) {
        state.workspaces[index] = action.payload;
        localStorage.setItem("workspaces", JSON.stringify(state.workspaces));
      }
    },
    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );
      localStorage.setItem("workspaces", JSON.stringify(state.workspaces));
    },
    clearWorkspaces: (state) => {
      state.workspaces = [];
      localStorage.removeItem("workspaces");
    },
  },
});

export const {
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  clearWorkspaces,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;