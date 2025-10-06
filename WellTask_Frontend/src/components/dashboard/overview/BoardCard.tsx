import { useNavigate } from "react-router-dom";

interface BoardCardProps {
  id: string;
  name: string;
  bgColor?: string;
}

export function BoardCard({
  id,
  name,
  bgColor = "bg-blue-100",
}: BoardCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`${bgColor} p-4 rounded-lg hover:${bgColor.replace(
        "100",
        "200"
      )} cursor-pointer flex flex-col gap-2`}
      onClick={() => navigate(`/dashboard/board/${id}`)}
    >
      <span className="text-gray-800 font-medium">{name}</span>
    </div>
  );
}
