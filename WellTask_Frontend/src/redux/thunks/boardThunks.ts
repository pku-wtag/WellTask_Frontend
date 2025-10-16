import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Board, List, Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import {
  addBoardToWorkspace,
  updateBoard,
  removeBoard,
  setError,
  setMessage,
} from "../slices/boardSlice";
import { updateUser } from "../slices/authSlice";

// ---------------- ADD BOARD ----------------
export const addBoard = createAsyncThunk<
  { workspaceId: string; board: Board },
  { workspaceId: string; name: string },
  { rejectValue: string }
>(
  "board/addBoard",
  async ({ workspaceId, name }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const workspace = workspaces.find((w) => w.id === workspaceId);

      if (!workspace) {
        const msg = "Workspace not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const backlogCards: Card[] = [
        { id: uuidv4(), name: "Define project scope", description: "" },
        { id: uuidv4(), name: "Gather requirements", description: "" },
      ];

      const inProgressCards: Card[] = [
        { id: uuidv4(), name: "Set up repo", description: "" },
      ];

      const doneCards: Card[] = [
        { id: uuidv4(), name: "Initial meeting", description: "" },
      ];

      const newBoard: Board = {
        id: uuidv4(),
        name,
        starred: false,
        lists: [
          { id: uuidv4(), name: "Backlog", cards: backlogCards } as List,
          { id: uuidv4(), name: "In Progress", cards: inProgressCards } as List,
          { id: uuidv4(), name: "Done", cards: doneCards } as List,
        ],
      };

      workspace.boards.push(newBoard);
      saveWorkspaces(workspaces);

      const user = getCurrentUser();

      if (user) {
        user.workspaces =
          user.workspaces?.map((w) => {
            if (w.id === workspaceId) {
              return { ...w, boards: workspace.boards };
            } else {
              return w;
            }
          }) || [];

        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(addBoardToWorkspace({ workspaceId, board: newBoard }));
      dispatch(setMessage("Board added successfully!"));

      return { workspaceId, board: newBoard };
    } catch (err) {
      const msg = (err as Error).message || "Failed to create board";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// ---------------- EDIT BOARD ----------------
export const editBoard = createAsyncThunk<
  { workspaceId: string; board: Board },
  { workspaceId: string; boardId: string; updates: Partial<Board> },
  { rejectValue: string }
>(
  "board/editBoard",
  async ({ workspaceId, boardId, updates }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const workspace = workspaces.find((w) => w.id === workspaceId);

      if (!workspace) {
        const msg = "Workspace not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const index = workspace.boards.findIndex((b) => b.id === boardId);

      if (index === -1) {
        const msg = "Board not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      const updated = { ...workspace.boards[index], ...updates };
      workspace.boards[index] = updated;
      saveWorkspaces(workspaces);

      const user = getCurrentUser();

      if (user) {
        user.workspaces =
          user.workspaces?.map((w) => {
            if (w.id === workspaceId) {
              return { ...w, boards: workspace.boards };
            } else {
              return w;
            }
          }) || [];

        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(updateBoard({ workspaceId, board: updated }));
      dispatch(setMessage("Board updated successfully!"));

      return { workspaceId, board: updated };
    } catch (err) {
      const msg = (err as Error).message || "Failed to update board";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// ---------------- DELETE BOARD ----------------
export const deleteBoard = createAsyncThunk<
  { workspaceId: string; boardId: string },
  { workspaceId: string; boardId: string },
  { rejectValue: string }
>(
  "board/deleteBoard",
  async ({ workspaceId, boardId }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const workspace = workspaces.find((w) => w.id === workspaceId);

      if (!workspace) {
        const msg = "Workspace not found";
        dispatch(setError(msg));
        return rejectWithValue(msg);
      }

      workspace.boards = workspace.boards.filter((b) => b.id !== boardId);
      saveWorkspaces(workspaces);

      const user = getCurrentUser();

      if (user) {
        user.workspaces =
          user.workspaces?.map((w) => {
            if (w.id === workspaceId) {
              return { ...w, boards: workspace.boards };
            } else {
              return w;
            }
          }) || [];

        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(removeBoard({ workspaceId, boardId }));
      dispatch(setMessage("Board deleted successfully!"));

      return { workspaceId, boardId };
    } catch (err) {
      const msg = (err as Error).message || "Failed to delete board";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);
