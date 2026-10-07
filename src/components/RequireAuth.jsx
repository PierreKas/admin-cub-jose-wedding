import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Optionally pass `roles` (e.g. ["ADMIN"]) to also gate on role - a
 * logged-in user whose role doesn't match is redirected to `fallback`
 * (default "/admin/scanner", the one page every role can reach - Protocol's
 * only page). Pass a different `fallback` for ADMIN-only write pages that a
 * read-only CO_ADMIN shouldn't land on either (e.g. the invitee form) -
 * CO_ADMIN has broad read access elsewhere, so /admin/scanner would be a
 * confusing bounce for them specifically.
 */
const RequireAuth = ({ children, roles, fallback = "/admin/scanner" }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to={fallback} replace />;
  }
  return children;
};

export default RequireAuth;
