import { v4 as uuidv4 } from "uuid";
import type {
  Workspace,
  Board,
  List,
  Card,
} from "@/redux/slices/workspaceSlice";

export const templates: Workspace[] = [
  {
    id: uuidv4(),
    name: "Project Management",
    type: "business",
    description: "Organize projects, assign tasks, and track progress.",
    boards: [
      {
        id: uuidv4(),
        name: "Team Planning",
        lists: [
          {
            id: uuidv4(),
            name: "To Do",
            cards: [
              { id: uuidv4(), name: "Define project goals" },
              { id: uuidv4(), name: "Assign team members" },
            ] as Card[],
          },
          {
            id: uuidv4(),
            name: "In Progress",
            cards: [
              { id: uuidv4(), name: "Design wireframes" },
              { id: uuidv4(), name: "Setup project repo" },
            ] as Card[],
          },
          {
            id: uuidv4(),
            name: "Done",
            cards: [
              { id: uuidv4(), name: "Kickoff meeting" },
              { id: uuidv4(), name: "Requirements approved" },
            ] as Card[],
          },
        ] as List[],
      } as Board,
    ] as Board[],
  },
];
