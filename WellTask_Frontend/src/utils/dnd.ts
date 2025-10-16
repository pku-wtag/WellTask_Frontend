import type { Card } from "@/types/Workspace";

export const reorder = (
  list: Card[],
  startIndex: number,
  endIndex: number
): Card[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
