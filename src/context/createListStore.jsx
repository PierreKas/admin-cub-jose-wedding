import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";

/**
 * Fabrique un petit store CRUD (liste d'objets { id, name, ... }) adosse a
 * l'API reelle - utilisee par les tables (voir api/namedListApi.js cote
 * backend comme cote frontend; les boissons ont depuis leur propre store
 * sur mesure, context/DrinksContext.jsx, a cause du champ `alcoholic` en
 * plus). Renvoie un Provider et un hook useStore distincts, chacun
 * re-exporte depuis son propre fichier pour ne pas melanger
 * composant/hook dans un seul module (react-refresh).
 */
export function createListStore(api) {
  const Ctx = createContext(null);

  function Provider({ children }) {
    const { isAuthenticated, role } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tables admin CRUD is admin/co-admin only (JwtAuthFilter) - a Protocol account never needs this list.
    const refresh = useCallback(async () => {
      if (!isAuthenticated || !["ADMIN", "CO_ADMIN"].includes(role)) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        setItems(await api.list());
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, [isAuthenticated, role]);

    useEffect(() => {
      refresh();
    }, [refresh]);

    const add = useCallback(async (name) => {
      const item = await api.create(name);
      setItems((list) => [...list, item]);
      return item;
    }, []);

    const update = useCallback(async (id, patch) => {
      const item = await api.rename(id, patch.name);
      setItems((list) => list.map((it) => (it.id === id ? item : it)));
      return item;
    }, []);

    const remove = useCallback(async (id) => {
      await api.remove(id);
      setItems((list) => list.filter((it) => it.id !== id));
    }, []);

    const value = { items, loading, add, update, remove };

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  }

  function useStore() {
    const ctx = useContext(Ctx);
    if (!ctx) {
      throw new Error("Store used outside of its Provider");
    }
    return ctx;
  }

  return { Provider, useStore };
}
