export interface Card {
  id: string;
  name: string;
  description?: string;
}

export interface List {
  id: string;
  name: string;
  cards: Card[];
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