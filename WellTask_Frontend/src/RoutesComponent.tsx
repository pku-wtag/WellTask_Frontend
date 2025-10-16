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
import { ProtectedRoute } from "./components/base-component/ProtectedRoute";
import WorkspaceBoardsPage from "./pages/workspace-boards";

const RoutesComponent: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const PublicRouteWrapper: React.FC = () => {
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
  };

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<DashBoardPage />} />
      </Route>

      <Route element={<PublicRouteWrapper />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
      </Route>

      <Route
        path="/workspace"
        element={<ProtectedRoute showNavbar={false} showSidebar={false} />}
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
    </Routes>
  );
};

export default RoutesComponent;
