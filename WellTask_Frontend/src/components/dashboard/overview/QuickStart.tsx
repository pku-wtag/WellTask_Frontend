import { TemplateCard } from "./TemplateCard";
import { WorkspaceCard } from "./WorkspaceCard";
import { Plus } from "lucide-react";
import WorkspacePage from "@/components/workspace/Workspace";
import { useState } from "react";
import { templates } from "@/data/templates";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type {
  Workspace,
  Board,
  List,
  Card,
} from "@/redux/slices/workspaceSlice";
import { v4 as uuidv4 } from "uuid";

export function QuickStart() {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const navigate = useNavigate();

  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );

  const handleTemplateClick = (template: Workspace) => {
    const newWorkspace: Workspace = {
      ...template,
      id: uuidv4(),
      boards: template.boards.map((board: Board) => ({
        ...board,
        id: uuidv4(),
        lists: board.lists.map((list: List) => ({
          ...list,
          id: uuidv4(),
          cards: list.cards.map((card: Card) => ({
            ...card,
            id: uuidv4(),
          })),
        })),
      })),
    };

    navigate(`/dashboard/board/${newWorkspace.boards[0].id}`, {
      state: { workspace: newWorkspace },
    });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Workspaces
        </h3>

        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}

        <div
          className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600 font-medium"
          onClick={() => setIsWorkspaceModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Workspace
        </div>
      </div>

      {isWorkspaceModalOpen && (
        <WorkspacePage isModal onClose={() => setIsWorkspaceModalOpen(false)} />
      )}
    </div>
  );
}
