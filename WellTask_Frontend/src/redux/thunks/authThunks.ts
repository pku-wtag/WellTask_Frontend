import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types/User";
import { startLoading, setAuthUser, updateUser, setError } from "@/redux/slices/authSlice";
import { getAllUsers, getUserByEmail, saveAllUsers } from "@/utils/authStorage";

export const AuthErrorCode = {
  EMAIL_EXISTS: "EMAIL_EXISTS",
  NO_ACCOUNT: "NO_ACCOUNT",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  UNKNOWN: "UNKNOWN",
} as const;

export type AuthErrorCodeType = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

// ---------------- SIGNUP ----------------
export const signupUser = createAsyncThunk<
  User,
  { fullname: string; email: string; password: string },
  { rejectValue: { code: AuthErrorCodeType; message: string } }
>(
  "auth/signupUser",
  async ({ fullname, email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());

      const existingUser = getUserByEmail(email);
      if (existingUser) {
        const msg = "An account with this email already exists.";
        dispatch(setError(msg));
        return rejectWithValue({ code: AuthErrorCode.EMAIL_EXISTS, message: msg });
      }

      const newUser: User = {
        id: Date.now().toString(),
        fullname,
        email,
        password,
        token: "dummy-token",
      };

      const users = getAllUsers();
      users.push(newUser);
      saveAllUsers(users);

      dispatch(setAuthUser({ user: newUser, message: "Signup successful!" }));
      return newUser;
    } catch (err) {
      const msg = (err as Error).message || "Signup failed.";
      dispatch(setError(msg));
      return rejectWithValue({ code: AuthErrorCode.UNKNOWN, message: msg });
    }
  }
);

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: { code: AuthErrorCodeType; message: string } }
>(
  "auth/loginUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());

      const user = getUserByEmail(email);
      if (!user) {
        const msg = "No account found. Please sign up.";
        dispatch(setError(msg));
        return rejectWithValue({ code: AuthErrorCode.NO_ACCOUNT, message: msg });
      }

      if (user.password !== password) {
        const msg = "Invalid email or password.";
        dispatch(setError(msg));
        return rejectWithValue({ code: AuthErrorCode.INVALID_CREDENTIALS, message: msg });
      }

      dispatch(setAuthUser({ user, message: "Login successful!" }));
      return user;
    } catch (err) {
      const msg = (err as Error).message || "Login failed.";
      dispatch(setError(msg));
      return rejectWithValue({ code: AuthErrorCode.UNKNOWN, message: msg });
    }
  }
);

// ---------------- PASSWORD RECOVERY ----------------
export const sendRecoveryLink = createAsyncThunk<
  string,
  string,
  { rejectValue: { code: AuthErrorCodeType; message: string } }
>(
  "auth/sendRecoveryLink",
  async (email, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());

      const user = getUserByEmail(email);
      if (!user) {
        const msg = "No account found. Please sign up.";
        dispatch(setError(msg));
        return rejectWithValue({ code: AuthErrorCode.NO_ACCOUNT, message: msg });
      }

      const msg = `Recovery link sent to ${email}`;
      dispatch(setAuthUser({ user, message: msg }));
      return msg;
    } catch (err) {
      const msg = (err as Error).message || "Failed to send recovery link.";
      dispatch(setError(msg));
      return rejectWithValue({ code: AuthErrorCode.UNKNOWN, message: msg });
    }
  }
);

// ---------------- RESET PASSWORD ----------------
export const resetPassword = createAsyncThunk<
  User,
  { password: string },
  { rejectValue: { code: AuthErrorCodeType; message: string }; state: { auth: { user: User | null } } }
>(
  "auth/resetPassword",
  async ({ password }, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(startLoading());
      const state = getState();
      const user = state.auth.user;

      if (!user) {
        const msg = "No account found. Please sign up.";
        dispatch(setError(msg));
        return rejectWithValue({ code: AuthErrorCode.NO_ACCOUNT, message: msg });
      }

      const users = getAllUsers();
      const updatedUsers = users.map((existingUser: User) =>
        existingUser.email === user.email ? { ...user, password } : existingUser
      );

      saveAllUsers(updatedUsers);

      dispatch(updateUser({ password }));
      return { ...user, password };
    } catch (err) {
      const msg = (err as Error).message || "Password reset failed.";
      dispatch(setError(msg));
      return rejectWithValue({ code: AuthErrorCode.UNKNOWN, message: msg });
    }
  }
);
