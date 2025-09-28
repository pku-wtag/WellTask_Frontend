import { BoardList } from "./BoardList";
import { BoardNavbar } from "./BoardNavbar";

export default function Board() {
  // Dummy data for testing
  const lists = [
    {
      id: "1",
      title: "To Do",
      cards: [
        { id: "c1", title: "Design homepage" },
        { id: "c2", title: "Fix login bug" },
      ],
    },
    {
      id: "2",
      title: "In Progress",
      cards: [
        { id: "c3", title: "API integration" },
        { id: "c4", title: "Write unit tests" },
      ],
    },
    {
      id: "3",
      title: "Done",
      cards: [
        { id: "c5", title: "Setup project repo" },
        { id: "c6", title: "Deploy to staging" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <BoardNavbar name="Project A" starred />

      {/* Board content: lists side by side */}
      <div className="flex-1 overflow-x-auto px-4 py-4">
        <div className="flex items-start gap-4">
          {lists.map((list) => (
            <BoardList
              key={list.id}
              title={list.title}
              cards={list.cards}
              onAddCard={() => console.log("Add card to", list.title)}
              onMoreOptions={() => console.log("More options for", list.title)}
            />
          ))}

          {/* Add another list button */}
          <button className="w-72 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">
            + Add another list
          </button>
        </div>
      </div>
    </div>
  );
}
