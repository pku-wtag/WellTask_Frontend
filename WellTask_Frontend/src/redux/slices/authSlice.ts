import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/User";
import {
  saveUser,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
} from "@/utils/authStorage";
import type { Board, List } from "@/types/Workspace";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  message: string | null;
  forgotEmail: string | null;
  isVerified: boolean;
}

const currentUser = getCurrentUser();

const initialState: AuthState = {
  user: currentUser,
  isAuthenticated: !!currentUser,
  error: null,
  message: null,
  forgotEmail: null,
  isVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;

      saveUser(user);
      setCurrentUser(user.id);
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
      state.forgotEmail = null;
      state.isVerified = false;

      clearCurrentUser();
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) {
        return;
      }

      state.user = { ...state.user, ...action.payload };
      saveUser(state.user);
    },

    addBoardToUserWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; board: Board }>
    ) => {
      if (!state.user?.workspaces) {
        return;
      }

      const workspace = state.user.workspaces.find(
        (w) => w.id === action.payload.workspaceId
      );

      if (workspace) {
        workspace.boards.push(action.payload.board);
        saveUser(state.user);
      }
    },

    addListToUserBoard: (
      state,
      action: PayloadAction<{ boardId: string; list: List }>
    ) => {
      if (!state.user?.workspaces) {
        return;
      }

      for (const ws of state.user.workspaces) {
        const board = ws.boards.find((b) => b.id === action.payload.boardId);
        if (board) {
          board.lists.push(action.payload.list);
          break;
        }
      }

      if (state.user) {
        saveUser(state.user);
      }
    },

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

    setForgotEmail: (state, action: PayloadAction<string>) => {
      state.forgotEmail = action.payload;
      state.isVerified = false;
    },

    setVerified: (state) => {
      state.isVerified = true;
    },

    clearForgotPasswordFlow: (state) => {
      state.forgotEmail = null;
      state.isVerified = false;
    },
  },
});

export const {
  setAuthUser,
  logout,
  updateUser,
  setError,
  setMessage,
  clearError,
  clearMessage,
  setForgotEmail,
  setVerified,
  clearForgotPasswordFlow,
  addBoardToUserWorkspace,
  addListToUserBoard,
} = authSlice.actions;

export default authSlice.reducer;
