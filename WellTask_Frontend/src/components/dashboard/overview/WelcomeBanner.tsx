import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export function WelcomeBanner() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        👋 Hi {user?.fullname || "there"}
      </h2>
      <p className="text-gray-600 text-md">
        Welcome! Here’s a quick overview of your boards and workspaces.
      </p>
    </div>
  );
}
