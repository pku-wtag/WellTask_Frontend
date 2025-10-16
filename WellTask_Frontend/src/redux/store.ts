import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import workspaceReducer from "./slices/workspaceSlice";
import boardReducer from "./slices/boardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    board: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
