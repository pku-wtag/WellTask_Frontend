import type { Workspace } from "@/types/Workspace";

export const getWorkspaces = (): Workspace[] => {
  const saved = localStorage.getItem("workspaces");
  return saved ? JSON.parse(saved) : [];
};

export const saveWorkspaces = (workspaces: Workspace[]) => {
  localStorage.setItem("workspaces", JSON.stringify(workspaces));
};
