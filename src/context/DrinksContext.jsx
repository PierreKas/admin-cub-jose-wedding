import React, { useCallback, useEffect, useState } from "react";
import { DrinksContext } from "./drinksContextObject";
import { useAuth } from "../hooks/useAuth";
import {
  createDrink,
  listDrinks,
  removeDrink as apiRemoveDrink,
  updateDrink as apiUpdateDrink,
} from "../api/drinksApi";

const ADMIN_ROLES = ["ADMIN", "CO_ADMIN"];

/**
 * Bespoke provider (not createListStore - see api/drinksApi.js for why).
 * Admin-only list (JwtAuthFilter) - CO_ADMIN also needs it (full read
 * access), PROTOCOL never does.
 */
export const DrinksProvider = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !ADMIN_ROLES.includes(role)) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setItems(await listDrinks());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async ({ name, alcoholic }) => {
    const item = await createDrink({ name: name.trim(), alcoholic });
    setItems((list) => [...list, item]);
    return item;
  }, []);

  const update = useCallback(async (id, { name, alcoholic }) => {
    const item = await apiUpdateDrink(id, { name: name.trim(), alcoholic });
    setItems((list) => list.map((it) => (it.id === id ? item : it)));
    return item;
  }, []);

  const remove = useCallback(async (id) => {
    await apiRemoveDrink(id);
    setItems((list) => list.filter((it) => it.id !== id));
  }, []);

  const value = { items, loading, add, update, remove };

  return <DrinksContext.Provider value={value}>{children}</DrinksContext.Provider>;
};
