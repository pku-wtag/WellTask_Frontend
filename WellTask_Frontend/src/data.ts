import type { Board, List, Card } from "@/types/Workspace";

export const templateDefaults: Record<string, Board> = {
  Kanban: {
    id: "template-kanban",
    name: "Kanban Board",
    lists: [
      {
        id: "kanban-list-backlog",
        name: "Backlog",
        cards: [
          { id: "kanban-card-1", name: "Define project scope" },
          { id: "kanban-card-2", name: "Gather requirements" },
        ] as Card[],
      },
      {
        id: "kanban-list-inprogress",
        name: "In Progress",
        cards: [
          { id: "kanban-card-3", name: "Develop main features" },
        ] as Card[],
      },
      {
        id: "kanban-list-done",
        name: "Done",
        cards: [
          { id: "kanban-card-4", name: "Set up project repository" },
        ] as Card[],
      },
    ] as List[],
  },

  "Project Plan": {
    id: "template-project-plan",
    name: "Project Plan Board",
    lists: [
      {
        id: "pp-list-phase1",
        name: "Phase 1 Tasks",
        cards: [
          { id: "pp-card-1", name: "Initial research" },
          { id: "pp-card-2", name: "Draft plan" },
        ] as Card[],
      },
      {
        id: "pp-list-phase2",
        name: "Phase 2 Tasks",
        cards: [
          { id: "pp-card-3", name: "Execution" },
          { id: "pp-card-4", name: "Review" },
        ] as Card[],
      },
    ] as List[],
  },

  Marketing: {
    id: "template-marketing",
    name: "Marketing Board",
    lists: [
      {
        id: "marketing-list-ideas",
        name: "Ideas",
        cards: [
          { id: "marketing-card-1", name: "New campaign concepts" },
        ] as Card[],
      },
      {
        id: "marketing-list-campaigns",
        name: "Campaigns",
        cards: [
          { id: "marketing-card-2", name: "Launch email campaign" },
          { id: "marketing-card-3", name: "Social media ads" },
        ] as Card[],
      },
      {
        id: "marketing-list-completed",
        name: "Completed",
        cards: [
          { id: "marketing-card-4", name: "Marketing plan approval" },
        ] as Card[],
      },
    ] as List[],
  },
};
