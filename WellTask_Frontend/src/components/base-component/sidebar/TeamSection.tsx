import { ChevronDown, Layout, Users, Settings, CreditCard } from "lucide-react";
import { Button } from "../Button";

interface TeamSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  workspaceName?: string;
}

export function TeamSection({
  isOpen,
  onToggle,
  workspaceName,
}: TeamSectionProps) {
  return (
    <div className="mt-4 flex flex-col gap-1">
      <Button
        type="custom"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-gray-100"
      >
        <span className="font-semibold text-gray-800">
          {workspaceName || "Select Workspace"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && workspaceName && (
        <div className="pl-4 flex flex-col gap-1 mt-1 transition-all duration-300">
          <Button
            type="custom"
            className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-blue-100 text-black"
          >
            <Layout className="w-5 h-5" /> Boards
          </Button>
          <Button
            type="custom"
            className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-blue-100 text-black"
          >
            <Users className="w-5 h-5" /> Members
          </Button>
          <Button
            type="custom"
            className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-blue-100 text-black"
          >
            <Settings className="w-5 h-5" /> Settings
          </Button>
          <Button
            type="custom"
            className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-blue-100 text-black"
          >
            <CreditCard className="w-5 h-5" /> Billing
          </Button>
        </div>
      )}
    </div>
  );
}
