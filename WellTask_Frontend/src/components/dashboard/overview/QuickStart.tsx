import { useState } from "react";
import { TemplateCard } from "./TemplateCard";
import { WorkspaceCard } from "./WorkspaceCard";
import { Plus } from "lucide-react";
import Workspace from "@/components/workspace/Workspace";
import type { Workspace as WorkspaceType } from "@/types/Workspace";

const templates = ["Kanban", "Project Plan", "Marketing", "Product Launch"];

export function QuickStart() {
  const [isWorkspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [userWorkspaces, setUserWorkspaces] = useState<WorkspaceType[]>([]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template} name={template} />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Your Workspaces</h3>

        {userWorkspaces.length === 0 && (
          <p className="text-gray-500">No workspaces yet. Create one!</p>
        )}

        {userWorkspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            name={workspace.name}
            boards={workspace.boards}
          />
        ))}

        <div
          className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600 font-medium"
          onClick={() => setWorkspaceModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Workspace
        </div>
      </div>

      {isWorkspaceModalOpen && (
        <Workspace
          isModal={true}
          onClose={() => setWorkspaceModalOpen(false)}
        />
      )}
    </div>
  );
}
