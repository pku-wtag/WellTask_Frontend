import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Workspace, Board, List, Card } from "@/types/Workspace";
import { v4 as uuidv4 } from "uuid";
import {
  startLoading,
  setError,
  setMessage,
} from "@/redux/slices/workspaceSlice";
import { getWorkspaces, saveWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser, saveUser } from "@/utils/authStorage";

export const addWorkspace = createAsyncThunk<
  Workspace,
  { name: string; type: string; description?: string },
  { rejectValue: string }
>(
  "workspace/addWorkspace",
  async ({ name, type, description }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());

      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("No user logged in");

      const defaultBoards: Board[] = [
        {
          id: uuidv4(),
          name: "To Do",
          lists: [
            {
              id: uuidv4(),
              name: "Backlog",
              cards: [
                { id: uuidv4(), name: "Welcome to your workspace!" } as Card,
                { id: uuidv4(), name: "Create your first project" } as Card,
              ],
            } as List,
            {
              id: uuidv4(),
              name: "In Progress",
              cards: [
                { id: uuidv4(), name: "Learn how to use boards" } as Card,
              ],
            } as List,
            {
              id: uuidv4(),
              name: "Done",
              cards: [
                { id: uuidv4(), name: "Workspace setup completed" } as Card,
              ],
            } as List,
          ],
        } as Board,
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

      currentUser.workspaces = [
        ...(currentUser.workspaces || []),
        newWorkspace,
      ];

      saveUser(currentUser);

      dispatch(setMessage("Workspace created successfully!"));
      return newWorkspace;
    } catch (err) {
      const msg = (err as Error).message || "Failed to create workspace.";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);
