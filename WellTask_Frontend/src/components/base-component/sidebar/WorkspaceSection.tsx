import { Plus, X } from "lucide-react";
import { Button } from "../Button";

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
        <span className="font-semibold">Team Alpha</span>
        <Plus
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="w-full bg-blue-50 rounded-lg shadow-sm p-2 flex flex-col gap-1 transition-all duration-300">
          <Button
            type="custom"
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 font-semibold bg-blue-100"
          >
            Team Alpha
          </Button>
          <Button
            type="custom"
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100"
          >
            Marketing
          </Button>
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
