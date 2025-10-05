import React from "react";
import { Navigate } from "react-router-dom";

// Stub: replace `isAuthenticated` with your auth logic later
const isAuthenticated = () => false;

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{element}</>;
}
