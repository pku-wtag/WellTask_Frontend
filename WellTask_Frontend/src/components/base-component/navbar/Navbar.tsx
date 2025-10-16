import { Bell, Menu, User, HelpCircle, LogOut } from "lucide-react";
import { NavButton } from "./NavButton";

interface NavbarProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Navbar({ onMenuClick, onLogout }: NavbarProps) {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <NavButton
          icon={<Menu className="w-5 h-5 text-gray-600" />}
          onClick={onMenuClick}
          className="p-2 rounded hover:bg-gray-100"
        />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
            W
          </div>
          <span className="text-gray-800 font-semibold text-sm">Well Task</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NavButton
          icon={<Bell className="w-5 h-5" />}
          badge
          aria-label="Notifications"
        />
        <NavButton
          icon={<HelpCircle className="w-5 h-5" />}
          aria-label="Help"
        />
        <NavButton icon={<User className="w-5 h-5" />} />
        <NavButton
          icon={<LogOut className="w-5 h-5 text-red-600" />}
          onClick={onLogout}
          aria-label="Logout"
        />
      </div>
    </header>
  );
}
