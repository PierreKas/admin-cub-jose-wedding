import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContextObject";
import { login as loginRequest, fetchMe } from "../api/authApi";
import { getAuthToken, setAuthToken, setUnauthorizedHandler } from "../api/apiClient";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()));

  const logout = useCallback(() => {
    setAuthToken(null);
    setIsAuthenticated(false);
  }, []);

  // A 401 from any api/*.js call (expired/invalid token) logs the admin out everywhere, not just on the request that happened to fail.
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // A token kept across a reload might have expired or been revoked server-side - confirm it before trusting it.
  useEffect(() => {
    if (!getAuthToken()) return;
    fetchMe().catch(() => logout());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const { token } = await loginRequest(username, password);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
