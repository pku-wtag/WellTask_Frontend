import { Plus, X } from "lucide-react";
import { Button } from "../Button";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface WorkspaceSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function WorkspaceSection({
  isOpen,
  onToggle,
  onClose,
}: WorkspaceSectionProps) {
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );

  return (
    <div>
      <div className="flex items-center justify-between px-2 pt-2">
        <span className="px-1 text-gray-500 uppercase text-xs font-semibold">
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
        <span className="font-semibold">
          {workspaces[0]?.name || "Workspace"}
        </span>
        <Plus
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="w-full bg-blue-50 rounded-lg shadow-sm p-2 flex flex-col gap-1 transition-all duration-300">
          {workspaces.map((ws) => (
            <Button
              key={ws.id}
              type="custom"
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 font-semibold"
            >
              {ws.name}
            </Button>
          ))}

          <Button
            type="custom"
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Workspace
          </Button>
        </div>
      )}
    </div>
  );
}
