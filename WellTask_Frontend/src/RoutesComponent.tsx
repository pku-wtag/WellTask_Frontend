import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/sign-up";
import LoginPage from "./components/Login";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default RoutesComponent;
