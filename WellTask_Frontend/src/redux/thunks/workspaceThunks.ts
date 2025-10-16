import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Workspace, Board } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";
import {
  updateWorkspace,
  removeWorkspace,
  setError,
  setMessage,
} from "@/redux/slices/workspaceSlice";
import { updateUser } from "@/redux/slices/authSlice";

// ---------------- ADD WORKSPACE ----------------
export const addWorkspace = createAsyncThunk<
  Workspace,
  { name: string; type: string; description?: string },
  { rejectValue: string }
>(
  "workspace/addWorkspace",
  async ({ name, type, description }, { dispatch, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        const msg = "No user logged in";
        dispatch(setError(msg));

        return rejectWithValue(msg);
      }

      const defaultBoards: Board[] = [
        {
          id: uuidv4(),
          name: "To Do",
          lists: [
            {
              id: uuidv4(),
              name: "Backlog",
              cards: [
                { id: uuidv4(), name: "Welcome to your workspace!" },
                { id: uuidv4(), name: "Create your first project" },
              ],
            },
            {
              id: uuidv4(),
              name: "In Progress",
              cards: [{ id: uuidv4(), name: "Learn how to use boards" }],
            },
            {
              id: uuidv4(),
              name: "Done",
              cards: [{ id: uuidv4(), name: "Workspace setup completed" }],
            },
          ],
        },
      ];

      const newWorkspace: Workspace = {
        id: uuidv4(),
        name,
        type,
        description,
        boards: defaultBoards,
        ownerId: currentUser.id,
        members: [currentUser.id],
      };

      const workspaces = getWorkspaces();
      workspaces.push(newWorkspace);
      saveWorkspaces(workspaces);

      currentUser.workspaces = currentUser.workspaces
        ? [...currentUser.workspaces, newWorkspace]
        : [newWorkspace];
      saveUser(currentUser);

      dispatch(updateUser({ workspaces: currentUser.workspaces }));

      dispatch(setMessage("Workspace created successfully!"));

      return newWorkspace;
    } catch (err) {
      const msg = (err as Error).message || "Failed to create workspace";
      dispatch(setError(msg));

      return rejectWithValue(msg);
    }
  }
);

// ---------------- EDIT WORKSPACE ----------------
export const editWorkspace = createAsyncThunk<
  Workspace,
  { id: string; updates: Partial<Workspace> },
  { rejectValue: string }
>(
  "workspace/editWorkspace",
  async ({ id, updates }, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces();
      const index = workspaces.findIndex((w) => w.id === id);
      if (index === -1) {
        const msg = "Workspace not found";
        dispatch(setError(msg));

        return rejectWithValue(msg);
      }

      const updated = { ...workspaces[index], ...updates };
      workspaces[index] = updated;
      saveWorkspaces(workspaces);

      const user = getCurrentUser();

      if (user) {
        user.workspaces =
          user.workspaces?.map((w) => (w.id === id ? updated : w)) || [];
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(updateWorkspace(updated));

      dispatch(setMessage("Workspace updated successfully!"));

      return updated;
    } catch (err) {
      const msg = (err as Error).message || "Failed to update workspace";
      dispatch(setError(msg));

      return rejectWithValue(msg);
    }
  }
);

// ---------------- DELETE WORKSPACE ----------------
export const deleteWorkspace = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "workspace/deleteWorkspace",
  async (workspaceId, { dispatch, rejectWithValue }) => {
    try {
      const workspaces = getWorkspaces().filter((w) => w.id !== workspaceId);
      saveWorkspaces(workspaces);

      const user = getCurrentUser();

      if (user) {
        user.workspaces =
          user.workspaces?.filter((w) => w.id !== workspaceId) || [];
        saveUser(user);
        dispatch(updateUser({ workspaces: user.workspaces }));
      }

      dispatch(removeWorkspace(workspaceId));

      dispatch(setMessage("Workspace deleted successfully!"));

      return workspaceId;
    } catch (err) {
      const msg = (err as Error).message || "Failed to delete workspace";
      dispatch(setError(msg));

      return rejectWithValue(msg);
    }
  }
);
