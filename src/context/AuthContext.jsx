import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContextObject";
import { login as loginRequest, fetchMe } from "../api/authApi";
import { getAuthToken, setAuthToken, setUnauthorizedHandler } from "../api/apiClient";

const ROLE_STORAGE_KEY = "cj-wedding.admin-role.v1";
const USERNAME_STORAGE_KEY = "cj-wedding.admin-username.v1";

function readSession(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  try {
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    // stockage indisponible (navigation privee, quota) - on ignore
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()));
  const [role, setRole] = useState(() => readSession(ROLE_STORAGE_KEY));
  const [username, setUsername] = useState(() => readSession(USERNAME_STORAGE_KEY));

  const logout = useCallback(() => {
    setAuthToken(null);
    writeSession(ROLE_STORAGE_KEY, null);
    writeSession(USERNAME_STORAGE_KEY, null);
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
  }, []);

  // A 401 from any api/*.js call (expired/invalid token) logs the admin out everywhere, not just on the request that happened to fail.
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // A token (and the role/username kept alongside it) kept across a reload
  // might have expired or been revoked server-side - confirm it before
  // trusting it, and resync role/username in case they'd changed meanwhile.
  useEffect(() => {
    if (!getAuthToken()) return;
    fetchMe()
      .then((me) => {
        writeSession(ROLE_STORAGE_KEY, me.role);
        writeSession(USERNAME_STORAGE_KEY, me.username);
        setRole(me.role);
        setUsername(me.username);
      })
      .catch(() => logout());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (usernameInput, password) => {
    const response = await loginRequest(usernameInput, password);
    setAuthToken(response.token);
    writeSession(ROLE_STORAGE_KEY, response.role);
    writeSession(USERNAME_STORAGE_KEY, response.username);
    setIsAuthenticated(true);
    setRole(response.role);
    setUsername(response.username);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
