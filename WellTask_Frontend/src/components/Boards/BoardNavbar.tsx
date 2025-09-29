import {
  Star,
  MoreHorizontal,
  Users,
  Share2,
  Lock,
  Zap,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "../base-component/Button";

type BoardNavbarProps = {
  name: string;
  starred?: boolean;
  workspace?: string;
  visibility?: "private" | "workspace" | "public";
};

export function BoardNavbar({
  name,
  starred = false,
  visibility = "private",
}: BoardNavbarProps) {
  const visibilityIcon =
    visibility === "private" ? (
      <Lock className="w-4 h-4" />
    ) : visibility === "workspace" ? (
      <Users className="w-4 h-4" />
    ) : (
      <Share2 className="w-4 h-4" />
    );

  const visibilityText =
    visibility.charAt(0).toUpperCase() + visibility.slice(1);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-800">{name}</h1>
        <Star
          className={`w-5 h-5 cursor-pointer ${
            starred ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
          }`}
        />
        <span className="flex items-center gap-1 text-sm text-gray-600 px-2 py-0.5 rounded-md hover:bg-gray-100 cursor-pointer">
          {visibilityIcon}
          {visibilityText}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Button
          type="custom"
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100"
        >
          <Zap className="w-4 h-4" /> Power-Ups
        </Button>
        <Button
          type="custom"
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100"
        >
          <Calendar className="w-4 h-4" /> Views
        </Button>
        <Button
          type="custom"
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100"
        >
          <Filter className="w-4 h-4" /> Filter
        </Button>
        <Button
          type="custom"
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          <Users className="w-4 h-4" /> Invite
        </Button>
        <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-800" />
      </div>
    </div>
  );
}
