import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


interface ProtectedRouteProps {
  element: React.ReactNode;
}

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
}
