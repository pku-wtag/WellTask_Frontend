import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  ChevronsRightLeft,
  ChevronsLeftRight,
} from "lucide-react";
import { BoardCard } from "./BoardCard";
import { Button } from "../base-component/Button";
import type { Card } from "@/redux/slices/workspaceSlice";

interface ListProps {
  name: string;
  cards: Card[];
  onAddCard?: () => void;
  onMoreOptions?: () => void;
  onCardClick?: (id: string) => void;
}

export function BoardList({
  name,
  cards,
  onAddCard,
  onMoreOptions,
  onCardClick,
}: ListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div
        onClick={() => setIsCollapsed(false)}
        className="w-14 h-full bg-gray-50 rounded-lg shadow-sm border border-gray-200 py-4 px-2 cursor-pointer flex flex-col items-center justify-start hover:bg-gray-100 transition-colors"
        style={{ minHeight: "10rem" }}
      >
        <ChevronsLeftRight className="w-5 h-5 text-gray-500 shrink-0" />
        <h2 className="mt-4 text-sm font-semibold text-gray-800 [writing-mode:vertical-rl] transform rotate-180 whitespace-nowrap">
          {name}
        </h2>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col h-fit max-h-[90vh]">
      <div className="flex items-center justify-between px-3 py-2 shrink-0">
        <h2 className="text-sm font-semibold text-gray-800 truncate">{name}</h2>
        <div className="flex items-center gap-1">
          {onMoreOptions && (
            <MoreHorizontal
              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={onMoreOptions}
            />
          )}
          <ChevronsRightLeft
            className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setIsCollapsed(true)}
          />
        </div>
      </div>

      <div className="flex-1 px-3 py-1 space-y-2 overflow-y-auto min-h-0">
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            id={card.id}
            name={card.name}
            onClick={onCardClick}
          />
        ))}
      </div>

      {onAddCard && (
        <Button
          type="custom"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-b-lg shrink-0"
          onClick={onAddCard}
        >
          <Plus className="w-4 h-4" /> Add a card
        </Button>
      )}
    </div>
  );
}
