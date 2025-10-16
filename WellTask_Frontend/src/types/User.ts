import type { Workspace } from "@/types/Workspace";

export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
  token: string;
  workspaces?: Workspace[];
}
