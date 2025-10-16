export interface Card {
  id: string;
  name: string;
  description?: string;
  status?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  assignees?: string[];
  labels?: string[];
  dueDate?: string;
  index?: number;
}

export interface List {
  id: string;
  name: string;
  cards: Card[];
  index?: number;
}

export interface Board {
  id: string;
  name: string;
  starred?: boolean;
  lists: List[];
}

export interface Workspace {
  id: string;
  name: string;
  type: string;
  description?: string;
  boards: Board[];
  ownerId: string;
  members?: string[];
}
