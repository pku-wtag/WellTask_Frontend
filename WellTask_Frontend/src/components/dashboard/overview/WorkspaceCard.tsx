import { Folder, Plus, Settings } from "lucide-react";
import { Button } from "@/components/base-component/Button";
import { BoardCard } from "./BoardCard";
import { CreateBoard } from "./CreateBoard";
import { WorkspaceSettings } from "./WorkspaceSettings";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { Board, Workspace as WorkspaceType } from "@/types/Workspace";

interface WorkspaceCardProps {
  workspaceId: string;
  name: string;
  type: string;
  description?: string;
  boards: Board[];
  ownerId?: string;
  members?: string[];
  onSelectWorkspace?: () => void;
  isPageView?: boolean;
}

export function WorkspaceCard({
  workspaceId,
  name,
  type,
  description,
  boards,
  ownerId,
  members,
  onSelectWorkspace,
  isPageView = false,
}: WorkspaceCardProps) {
  const [isCreateBoardOpen, setCreateBoardOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const dispatch = useDispatch();

  const workspace: WorkspaceType = {
    id: workspaceId,
    name,
    type,
    description,
    boards,
    ownerId: ownerId || "",
    members: members || [],
  };

  useEffect(() => {
    if (isPageView) {
      dispatch({ type: "workspace/setCurrentWorkspace", payload: workspace });
    }
  }, [isPageView, dispatch, workspace]);

  return (
    <div
      className={`bg-gray-50 rounded-xl p-4 shadow-sm transition-shadow ${
        !isPageView ? "cursor-pointer hover:shadow-md" : ""
      }`}
      onClick={onSelectWorkspace}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 text-gray-800 font-medium">
          <Folder className="w-5 h-5" />
          <span className="truncate">{name}</span>
        </div>

        {!isPageView && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="custom"
              size="small"
              className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen(true);
              }}
            >
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </div>
        )}
      </div>

      <div
        className={`grid gap-4 ${
          isPageView
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        }`}
      >
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            name={board.name}
            workspaceId={workspace.id}
          />
        ))}

        <div
          className="flex items-center justify-center p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-600 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            setCreateBoardOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Board
        </div>
      </div>

      {isCreateBoardOpen && (
        <CreateBoard
          workspaceId={workspace.id}
          isOpen={isCreateBoardOpen}
          onClose={() => setCreateBoardOpen(false)}
        />
      )}

      {isSettingsOpen && !isPageView && (
        <WorkspaceSettings
          workspace={workspace}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
