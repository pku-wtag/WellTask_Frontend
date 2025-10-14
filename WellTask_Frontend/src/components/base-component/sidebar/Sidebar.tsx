import { useState } from "react";
import classNames from "classnames";
import { WorkspaceSection } from "./WorkspaceSection";
import { TeamSection } from "./TeamSection";
import { NavigationSection } from "./NavigationSection";
import type { Workspace } from "@/types/Workspace";
import WorkSpace from "@/components/workspace/Workspace";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "@/redux/slices/workspaceSlice";
import type { RootState } from "@/redux/store";
import { WorkspaceSettings } from "@/components/dashboard/overview/WorkspaceSettings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isNavOpen, setIsNavBarOpen] = useState(true);
  const [isWorkspaceModalOpen, setWorkspaceModalOpen] = useState(false);

  const sidebarClasses = classNames(
    "fixed inset-y-0 left-0 z-30 h-screen bg-white shadow-lg transform transition-all duration-300 ease-in-out md:relative md:h-full md:inset-y-auto md:left-auto md:shadow-sm overflow-hidden",
    isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
  );

  const handleWorkspaceSelect = (workspace: Workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    setIsWorkspaceOpen(false);
  };

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
              onWorkspaceSelect={handleWorkspaceSelect}
              onAddWorkspace={() => setWorkspaceModalOpen(true)}
            />

            <TeamSection
              isOpen={isNavOpen}
              onToggle={() => setIsNavBarOpen((prev) => !prev)}
              workspace={currentWorkspace}
              onOpenSettings={() => setWorkspaceModalOpen(true)}
            />

            <NavigationSection />
          </div>
        </div>
      </div>

      {isWorkspaceModalOpen && !currentWorkspace && (
        <WorkSpace isModal onClose={() => setWorkspaceModalOpen(false)} />
      )}

      {isWorkspaceModalOpen && currentWorkspace && (
        <WorkspaceSettings
          workspace={currentWorkspace}
          onClose={() => setWorkspaceModalOpen(false)}
        />
      )}
    </>
  );
}
