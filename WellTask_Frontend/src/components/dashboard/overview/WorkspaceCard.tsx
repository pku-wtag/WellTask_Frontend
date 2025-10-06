import { Folder, Plus, Users, Settings } from "lucide-react";
import { Button } from "@/components/base-component/Button";
import { BoardCard } from "./BoardCard";
import { useNavigate } from "react-router-dom";
import type { Workspace, Board } from "@/redux/slices/workspaceSlice";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 text-gray-800 font-medium">
          <Folder className="w-5 h-5" />
          <span className="truncate">{workspace.name}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="custom"
            size="small"
            className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs sm:text-sm"
            onClick={() => navigate("/dashboard/board/new")}
          >
            <Plus className="w-4 h-4" /> Board
          </Button>
          <Button
            type="custom"
            size="small"
            className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs sm:text-sm"
          >
            <Users className="w-4 h-4" /> Members
          </Button>
          <Button
            type="custom"
            size="small"
            className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs sm:text-sm"
          >
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {workspace.boards?.map((board: Board) => (
          <BoardCard key={board.id} id={board.id} name={board.name} />
        ))}

        <div
          className="flex items-center justify-center p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-600 font-medium"
          onClick={() => navigate("/dashboard/board/new")}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Board
        </div>
      </div>
    </div>
  );
}
