import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import LoginPage from "./pages/login";
import SignupPage from "./pages/sign-up";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import VerifyCodePage from "./pages/verify-code";
import WorkspacePage from "./pages/work-space";
import DashBoardPage from "./pages/dash-board";
import BoardPage from "./pages/board";
import WorkspaceBoardsPage from "./pages/workspace-boards";
import { ProtectedRoute } from "./components/base-component/ProtectedRoute";

const RoutesComponent: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const PublicRouteWrapper: React.FC = () => {
    if (isAuthenticated) {
      if ((user?.workspaces?.length ?? 0) === 0) {
        return <Navigate to="/workspace" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
    return <Outlet />;
  };

  return (
    <Routes>
      <Route element={<PublicRouteWrapper />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
      </Route>

      <Route
        path="/workspace"
        element={<ProtectedRoute showNavbar={true} showSidebar={false} />}
      >
        <Route index element={<WorkspacePage />} />
      </Route>

      <Route path="/dashboard/*" element={<ProtectedRoute />}>
        <Route index element={<DashBoardPage />} />
        <Route path="board" element={<BoardPage />} />
        <Route
          path="workspace/:workspaceId/boards"
          element={<WorkspaceBoardsPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
