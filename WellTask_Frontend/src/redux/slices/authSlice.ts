import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/User";
import {
  saveUser,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
} from "@/utils/authStorage";

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
    setAuthUser: (
      state,
      action: PayloadAction<{ user: User; message?: string }>
    ) => {
      const { user, message } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      state.message = message || null;

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
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      saveUser(state.user);
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
} = authSlice.actions;

export default authSlice.reducer;
