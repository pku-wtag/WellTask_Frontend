import { Plus, X } from "lucide-react";
import { Button } from "../Button";
import { useEffect, useState } from "react";
import type { Workspace } from "@/types/Workspace";
import { getWorkspaces } from "@/utils/workspaceStorage";
import { getCurrentUser } from "@/utils/authStorage";

interface WorkspaceSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onWorkspaceSelect: (workspace: Workspace) => void;
  onAddWorkspace: () => void;
}

export function WorkspaceSection({
  isOpen,
  onToggle,
  onClose,
  onWorkspaceSelect,
  onAddWorkspace,
}: WorkspaceSectionProps) {
  const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const allWorkspaces = getWorkspaces();
      const myWorkspaces = allWorkspaces.filter((w) =>
        user.workspaces?.includes(w.id)
      );
      setUserWorkspaces(myWorkspaces);
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-2 pt-2">
        <span className="px-1 mb-2 text-gray-500 uppercase text-sm font-semibold">
          Workspaces
        </span>
        <Button
          type="custom"
          onClick={onClose}
          className="md:hidden p-1 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      <Button
        type="custom"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 px-3 bg-blue-100 rounded-lg hover:bg-blue-200"
      >
        <span className="font-semibold">My Workspaces</span>
        <Plus
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="w-full bg-blue-50 rounded-lg shadow-sm p-2 flex flex-col gap-1 transition-all duration-300">
          {userWorkspaces.map((workspace) => (
            <Button
              key={workspace.id}
              type="custom"
              onClick={() => onWorkspaceSelect(workspace)}
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 font-semibold"
            >
              {workspace.name}
            </Button>
          ))}

          <Button
            type="custom"
            onClick={onAddWorkspace}
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 flex items-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Workspace
          </Button>
        </div>
      )}
    </div>
  );
}
