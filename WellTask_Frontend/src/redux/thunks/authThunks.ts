import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types/User";
import {
  updateUser,
  setError,
  setMessage,
  setForgotEmail,
  clearForgotPasswordFlow,
} from "@/redux/slices/authSlice";
import { getAllUsers, getUserByEmail, saveAllUsers } from "@/utils/authStorage";

export const AuthErrorCode = {
  EMAIL_EXISTS: "EMAIL_EXISTS",
  NO_ACCOUNT: "NO_ACCOUNT",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNKNOWN: "UNKNOWN",
} as const;

export type AuthErrorCodeType =
  (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

// ---------------- SIGNUP ----------------
export const signupUser = createAsyncThunk<
  User,
  { fullname: string; email: string; password: string },
  { rejectValue: { code: AuthErrorCodeType; message: string } }
>(
  "auth/signupUser",
  async ({ fullname, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const existingUser = getUserByEmail(email);

      if (existingUser) {
        const msg = "An account with this email already exists.";

        dispatch(setError(msg));

        return rejectWithValue({
          code: AuthErrorCode.EMAIL_EXISTS,
          message: msg,
        });
      }

      const newUser: User = {
        id: Date.now().toString(),
        fullname,
        email,
        password,
        token: "dummy-token",
        workspaces: [],
      };

      const allUsers = getAllUsers();
      saveAllUsers([...allUsers, newUser]);

      dispatch(setMessage("Signup successful! Please log in."));

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
      const user = getUserByEmail(email);

      if (!user) {
        const msg = "No account found. Please sign up.";

        dispatch(setError(msg));

        return rejectWithValue({
          code: AuthErrorCode.NO_ACCOUNT,
          message: msg,
        });
      }

      if (user.password !== password) {
        const msg = "Invalid email or password.";

        dispatch(setError(msg));

        return rejectWithValue({
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: msg,
        });
      }

      dispatch(setMessage("Login successful!"));

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
>("auth/sendRecoveryLink", async (email, { dispatch, rejectWithValue }) => {
  try {
    const user = getUserByEmail(email);

    if (!user) {
      const msg = "No account found. Please sign up.";

      dispatch(setError(msg));

      return rejectWithValue({ code: AuthErrorCode.NO_ACCOUNT, message: msg });
    }

    dispatch(setForgotEmail(email));

    dispatch(setMessage(`Recovery link sent to ${email}`));

    return `Recovery link sent to ${email}`;
  } catch (err) {
    const msg = (err as Error).message || "Failed to send recovery link.";

    dispatch(setError(msg));

    return rejectWithValue({ code: AuthErrorCode.UNKNOWN, message: msg });
  }
});

// ---------------- RESET PASSWORD ----------------
export const resetPassword = createAsyncThunk<
  User,
  { password: string },
  {
    rejectValue: { code: AuthErrorCodeType; message: string };
    state: { auth: { user: User | null; forgotEmail: string | null } };
  }
>(
  "auth/resetPassword",
  async ({ password }, { dispatch, rejectWithValue, getState }) => {
    try {
      const email = getState().auth.forgotEmail;

      if (!email) {
        const msg = "Email not found. Please start the password recovery flow.";

        dispatch(setError(msg));

        return rejectWithValue({
          code: AuthErrorCode.NO_ACCOUNT,
          message: msg,
        });
      }

      const user = getUserByEmail(email);

      if (!user) {
        const msg = "No account found for this email.";

        dispatch(setError(msg));

        return rejectWithValue({
          code: AuthErrorCode.NO_ACCOUNT,
          message: msg,
        });
      }

      const updatedUsers = getAllUsers().map((u) =>
        u.email === email ? { ...user, password } : u
      );

      saveAllUsers(updatedUsers);
      dispatch(updateUser({ password }));

      dispatch(setMessage("Password updated successfully!"));

      dispatch(clearForgotPasswordFlow());

      return { ...user, password };
    } catch (err) {
      const msg = (err as Error).message || "Password reset failed.";

      dispatch(setError(msg));

      return rejectWithValue({ code: AuthErrorCode.UNKNOWN, message: msg });
    }
  }
);
