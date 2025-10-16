import type { Workspace } from "./Workspace";

export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
  token: string;
  workspaces?: Workspace[];
}
