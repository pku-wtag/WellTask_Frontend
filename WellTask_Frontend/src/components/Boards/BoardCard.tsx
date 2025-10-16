type BoardCardProps = {
  id: string;
  title: string;
  onClick?: (id: string) => void;
};

export function BoardCard({ id, title, onClick }: BoardCardProps) {
  return (
    <div
      onClick={() => onClick?.(id)}
      className="p-2 text-sm bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer"
    >
      {title}
    </div>
  );
}
