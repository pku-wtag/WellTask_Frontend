import { Star } from "lucide-react";

interface BoardCardProps {
  name: string;
  starred?: boolean;
  bgColor?: string;
}

export function BoardCard({
  name,
  starred,
  bgColor = "bg-blue-100",
}: BoardCardProps) {
  return (
    <div
      className={`${bgColor} p-4 rounded-lg hover:${bgColor.replace(
        "100",
        "200"
      )} cursor-pointer flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-800 font-medium">{name}</span>
        {starred && <Star className="w-5 h-5 text-yellow-500 ml-2" />}
      </div>
    </div>
  );
}
