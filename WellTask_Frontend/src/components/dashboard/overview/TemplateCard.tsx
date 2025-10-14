import { Layout, Plus } from "lucide-react";

interface TemplateCardProps {
  name: string;
  onClick?: () => void;
}

export function TemplateCard({ name, onClick }: TemplateCardProps) {
  return (
    <div
      className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer flex flex-col gap-2 transition-transform transform hover:scale-105"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Layout className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <span className="text-gray-800 font-medium truncate">{name}</span>
        </div>
        <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
      </div>
      <span className="text-xs text-gray-500">Quick start template</span>
    </div>
  );
}
