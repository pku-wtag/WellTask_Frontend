import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/User";
import { saveUser } from "@/utils/authStorage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    },

    setAuthUser: (
      state,
      action: PayloadAction<{ user: User; message?: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.message = action.payload.message || null;
      saveUser(action.payload.user);
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.message = null;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveUser(state.user);
      }
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.message = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  startLoading,
  setAuthUser,
  logout,
  updateUser,
  setError,
  clearError,
  setMessage,
  clearMessage,
} = authSlice.actions;

export default authSlice.reducer;
