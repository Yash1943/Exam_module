// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Simple auth check using localStorage (replace with real auth logic as needed)
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
