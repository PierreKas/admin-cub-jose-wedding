import React, { useCallback, useEffect, useState } from "react";
import { UsersContext } from "./usersContextObject";
import { useAuth } from "../hooks/useAuth";
import { createUser, deleteUser as apiDeleteUser, listUsers } from "../api/usersApi";

/** Admin-only (JwtAuthFilter) - who can log in, and with which role. */
export const UsersProvider = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || role !== "ADMIN") {
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setUsers(await listUsers());
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addUser = useCallback(async ({ username, password, role: newRole }) => {
    const user = await createUser({ username: username.trim(), password, role: newRole });
    setUsers((list) => [...list, user]);
    return user;
  }, []);

  const deleteUser = useCallback(async (id) => {
    await apiDeleteUser(id);
    setUsers((list) => list.filter((u) => u.id !== id));
  }, []);

  const value = { users, loading, addUser, deleteUser };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};
