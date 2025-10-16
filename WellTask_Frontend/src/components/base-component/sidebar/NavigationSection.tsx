import { MessageSquare, FileText, Calendar } from "lucide-react";
import { Button } from "../Button";

export function NavigationSection() {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <Button
        type="custom"
        className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-gray-100 text-black"
      >
        <MessageSquare className="w-5 h-5" /> Messages
      </Button>
      <Button
        type="custom"
        className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-gray-100 text-black"
      >
        <FileText className="w-5 h-5" /> Files
      </Button>
      <Button
        type="custom"
        className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-gray-100 text-black"
      >
        <Calendar className="w-5 h-5" /> Calendar
      </Button>
    </div>
  );
}
