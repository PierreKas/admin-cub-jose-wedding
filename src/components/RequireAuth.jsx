import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Optionally pass `roles` (e.g. ["ADMIN"]) to also gate on role - a logged-in user whose role doesn't match is sent to the one page every role can reach (the scanner), not back to /login. */
const RequireAuth = ({ children, roles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/admin/scanner" replace />;
  }
  return children;
};

export default RequireAuth;
