import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/sign-up";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import VerifyCodePage from "./pages/verify-code";
import WorkspacePage from "./pages/work-space";
import DashBoardPage from "./pages/dash-board";
import { ProtectedComponent } from "./components/base-component/ProtectedComponent";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
      <Route path="/workspace" element={<WorkspacePage />} />
      <Route path="/dashboard/*" element={<ProtectedComponent />}>
        <Route index element={<DashBoardPage />} />
      </Route>
    </Routes>
  );
};

export default RoutesComponent;
