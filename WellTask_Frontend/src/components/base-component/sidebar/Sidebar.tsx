import { useState } from "react";
import clsx from "classnames";
import { WorkspaceSection } from "./WorkspaceSection";
import { TeamSection } from "./TeamSection";
import { NavigationSection } from "./NavigationSection";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);

  const sidebarClasses = clsx(
    "fixed inset-y-0 left-0 z-30 h-screen bg-white shadow-lg transform transition-all duration-300 ease-in-out md:relative md:h-full md:inset-y-auto md:left-auto md:shadow-sm overflow-hidden",
    isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black z-20 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div className={sidebarClasses}>
        <div className="flex flex-col justify-between h-full p-2">
          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <WorkspaceSection
              isOpen={isWorkspaceOpen}
              onToggle={() => setIsWorkspaceOpen((prev) => !prev)}
              onClose={onClose}
            />

            <TeamSection
              isOpen={isNavOpen}
              onToggle={() => setIsNavOpen((prev) => !prev)}
            />

            <NavigationSection />
          </div>
        </div>
      </div>
    </>
  );
}
