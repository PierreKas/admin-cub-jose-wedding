import React, { useCallback, useEffect, useState } from "react";
import { InviteesContext } from "./inviteesContextObject";
import { decodeGuestPayload } from "../constants/qrPayload";

const STORAGE_KEY = "cj-wedding.invitees.v1";

const seed = () => {
  const now = Date.now();
  const mk = (name, type, status, minutesAgo) => ({
    id: crypto.randomUUID(),
    civility: "",
    name,
    type,
    status,
    checkedInAt:
      status === "present"
        ? new Date(now - minutesAgo * 60000).toISOString()
        : null,
    createdAt: new Date(now - (minutesAgo + 60) * 60000).toISOString(),
  });
  return [
    mk("Alice Kasanani", "couple", "present", 42),
    mk("Aline Kasanani", "single", "present", 15),
    mk("Simeon Kasanani", "couple", "attente", 0),
    mk("Moise Biringiro", "single", "attente", 0),
  ];
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : seed();
  } catch {
    return seed();
  }
};

export const InviteesProvider = ({ children }) => {
  const [invitees, setInvitees] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invitees));
    } catch {
      // stockage indisponible (navigation privee, quota) - on ignore pour la simulation
    }
  }, [invitees]);

  const addInvitee = useCallback(({ civility = "", name, type }) => {
    const guest = {
      id: crypto.randomUUID(),
      civility,
      name: name.trim(),
      type,
      status: "attente",
      checkedInAt: null,
      createdAt: new Date().toISOString(),
    };
    setInvitees((list) => [guest, ...list]);
    return guest;
  }, []);

  const updateInvitee = useCallback((id, patch) => {
    setInvitees((list) =>
      list.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    );
  }, []);

  const deleteInvitee = useCallback((id) => {
    setInvitees((list) => list.filter((g) => g.id !== id));
  }, []);

  const getInvitee = useCallback(
    (id) => invitees.find((g) => g.id === id) || null,
    [invitees],
  );

  /** Marque un invite present. Renvoie un statut pour piloter l'UI du scanner. */
  const markPresent = useCallback(
    (id) => {
      const guest = invitees.find((g) => g.id === id);
      if (!guest) return { outcome: "introuvable" };
      if (guest.status === "present") return { outcome: "deja_present", guest };
      const checkedInAt = new Date().toISOString();
      setInvitees((list) =>
        list.map((g) =>
          g.id === id ? { ...g, status: "present", checkedInAt } : g,
        ),
      );
      return { outcome: "ok", guest: { ...guest, status: "present", checkedInAt } };
    },
    [invitees],
  );

  /** Decode un QR scanne et resout l'invite correspondant dans le stockage local. */
  const resolveScannedCode = useCallback(
    (raw) => {
      const data = decodeGuestPayload(raw);
      if (!data) return { outcome: "invalide" };
      const guest = invitees.find((g) => g.id === data.id);
      if (!guest) return { outcome: "introuvable" };
      return { outcome: "trouve", guest };
    },
    [invitees],
  );

  const value = {
    invitees,
    addInvitee,
    updateInvitee,
    deleteInvitee,
    getInvitee,
    markPresent,
    resolveScannedCode,
  };

  return (
    <InviteesContext.Provider value={value}>
      {children}
    </InviteesContext.Provider>
  );
};
