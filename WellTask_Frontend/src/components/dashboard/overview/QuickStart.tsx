import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Workspace from "@/components/workspace/Workspace";
import { TemplateCard } from "./TemplateCard";
import { WorkspaceCard } from "./WorkspaceCard";
import type { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import type { Board, Workspace as WorkspaceType } from "@/types/Workspace";
import { setCurrentWorkspace } from "@/redux/slices/workspaceSlice";
import { templateDefaults } from "@/data";

export function QuickStart() {
  const [isWorkspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userWorkspaces: WorkspaceType[] = currentUser?.workspaces || [];

  const handleTemplateClick = (
    templateName: string,
    workspace?: WorkspaceType
  ) => {
    const board: Board | undefined = templateDefaults[templateName];

    if (!board) {
      return;
    }

    if (workspace) {
      dispatch(setCurrentWorkspace(workspace));
    }

    navigate(`/dashboard/board?id=${board.id}`, {
      state: { board, name: `${board.name} Template` },
    });
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(templateDefaults).map((template) => (
            <TemplateCard
              key={template}
              name={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Your Workspaces</h3>

        {userWorkspaces.length === 0 && (
          <p className="text-gray-500">No workspaces yet. Create one!</p>
        )}

        {userWorkspaces.map((workspace) => {
          const mergedBoards = [...(workspace.boards || [])];

          const boardsMap: Record<string, Board> = {};
          mergedBoards.forEach((b) => {
            boardsMap[b.id] = b;
          });

          const uniqueBoards = Object.values(boardsMap);

          return (
            <WorkspaceCard
              key={workspace.id}
              workspaceId={workspace.id}
              name={workspace.name}
              type={workspace.type}
              description={workspace.description}
              ownerId={workspace.ownerId}
              members={workspace.members}
              boards={uniqueBoards}
              onSelectWorkspace={() => {
                dispatch(setCurrentWorkspace(workspace));
              }}
            />
          );
        })}

        <div
          className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600 font-medium"
          onClick={() => {
            setWorkspaceModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Workspace
        </div>
      </div>

      {isWorkspaceModalOpen && (
        <Workspace
          isModal={true}
          onClose={() => {
            setWorkspaceModalOpen(false);
          }}
          onCreate={async (_workspaceName: string) => {
            setWorkspaceModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
