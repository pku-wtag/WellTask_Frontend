import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  fullname: string;
  email: string;
  token: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const savedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
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

    signupSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // keep password
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.message = "Signup successful!";
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // keep password
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.message = "Login successful!";
      localStorage.setItem("user", JSON.stringify(action.payload)); // include password for login
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
        localStorage.setItem("user", JSON.stringify(state.user));
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

    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  startLoading,
  signupSuccess,
  loginSuccess,
  logout,
  updateUser,
  setError,
  clearError,
  clearMessage,
} = authSlice.actions;

export default authSlice.reducer;
