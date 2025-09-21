import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "@/components/sign-up";
import LoginPage from "@/components/login";
import VerifyCodePage from "@/components/verify-code";
import ResetPasswordPage from "@/components/reset-password";
import ForgotPasswordPage from "./components/forgot-password";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
    </Routes>
  );
};

export default RoutesComponent;
