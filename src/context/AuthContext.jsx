import React, { useState } from "react";
import { AuthContext } from "./authContextObject";

const SESSION_KEY = "cj-wedding.admin-session.v1";

// Identifiants provisoires pour cette simulation frontend - a remplacer par
// une authentification reelle cote backend.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "mariage2026";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  const login = (username, password) => {
    const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
