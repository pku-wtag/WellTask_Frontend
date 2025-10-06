import { v4 as uuidv4 } from "uuid";
import type {
  Workspace,
  List,
  Board,
  Card,
} from "@/redux/slices/workspaceSlice";

export function createNewWorkspace(
  values: Record<string, unknown>
): Workspace | null {
  const workspaceName = String(values.workspaceName ?? "");
  const workspaceType = String(values.workspaceType ?? "");
  const workspaceDescription = String(values.workspaceDescription ?? "");

  if (!workspaceName || !workspaceType) return null;

  const todoCards: Card[] = [
    { id: uuidv4(), name: "Design homepage" },
    { id: uuidv4(), name: "Fix login bug" },
  ];

  const inProgressCards: Card[] = [
    { id: uuidv4(), name: "API integration" },
    { id: uuidv4(), name: "Write unit tests" },
  ];

  const doneCards: Card[] = [
    { id: uuidv4(), name: "Setup project repo" },
    { id: uuidv4(), name: "Deploy to staging" },
  ];

  const defaultLists: List[] = [
    { id: uuidv4(), name: "To Do", cards: todoCards },
    { id: uuidv4(), name: "In Progress", cards: inProgressCards },
    { id: uuidv4(), name: "Done", cards: doneCards },
  ];

  const defaultBoard: Board = {
    id: uuidv4(),
    name: "Welcome Board",
    starred: false,
    lists: defaultLists,
  };

  return {
    id: uuidv4(),
    name: workspaceName,
    type: workspaceType,
    description: workspaceDescription,
    boards: [defaultBoard],
  };
}