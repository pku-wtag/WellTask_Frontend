import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { WorkspaceCard } from "@/components/dashboard/overview/WorkspaceCard";

export function WorkspaceBoards() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const userWorkspaces = useSelector(
    (state: RootState) => state.auth.user?.workspaces || []
  );

  const workspace = userWorkspaces.find((w) => w.id === workspaceId);
  if (!workspace)
    return <div className="p-6 text-gray-500">Workspace not found.</div>;

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">{workspace.name}</h1>
        {workspace.description && (
          <p className="text-gray-500 mt-1">{workspace.description}</p>
        )}
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <WorkspaceCard
          workspaceId={workspace.id}
          name={workspace.name}
          type={workspace.type}
          description={workspace.description}
          boards={workspace.boards || []}
          ownerId={workspace.ownerId}
          members={workspace.members}
          isPageView={true}
        />
      </div>
    </div>
  );
}
