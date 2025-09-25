import { TemplateCard } from "./TemplateCard";
import { BoardCard } from "./BoardCard";
import { WorkspaceCard, type Board } from "./WorkspaceCard";
import { Plus } from "lucide-react";
type Workspace = {
  id: string;
  name: string;
  boards: Board[];
};

const dummyWorkspaces: Workspace[] = [
  {
    id: "w1",
    name: "Team Alpha",
    boards: [
      { id: "b1", name: "Project A", starred: true },
      { id: "b2", name: "Sprint Board" },
    ],
  },
];

const recentlyViewed: Board[] = [
  { id: "b5", name: "Design Sprint" },
  { id: "b6", name: "Bug Tracking" },
];

const templates = ["Kanban", "Project Plan", "Marketing", "Product Launch"];

export function QuickStart() {
  const starredBoards = dummyWorkspaces.flatMap((w) =>
    w.boards.filter((b) => b.starred)
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template} name={template} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recently Viewed
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentlyViewed.map((board) => (
            <BoardCard key={board.id} name={board.name} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Starred Boards
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {starredBoards.map((board) => (
            <BoardCard key={board.id} name={board.name} starred />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Workspaces
        </h3>

        {dummyWorkspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            name={workspace.name}
            boards={workspace.boards}
          />
        ))}

        <div className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600 font-medium">
          <Plus className="w-5 h-5 mr-2" /> Create Workspace
        </div>
      </div>
    </div>
  );
}
