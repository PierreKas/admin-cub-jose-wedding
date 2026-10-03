import React, { useCallback, useEffect, useState } from "react";
import { InviteesContext } from "./inviteesContextObject";
import { decodeGuestPayload } from "../constants/qrPayload";
import { useAuth } from "../hooks/useAuth";
import {
  checkinInvitee,
  createInvitee,
  deleteInvitee as apiDeleteInvitee,
  getInvitee as apiGetInvitee,
  listInvitees,
  updateInvitee as apiUpdateInvitee,
} from "../api/inviteesApi";

export const InviteesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [invitees, setInvitees] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setInvitees([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setInvitees(await listInvitees());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addInvitee = useCallback(async ({ civility = "", name, type, table = "" }) => {
    const guest = await createInvitee({ civility, name: name.trim(), type, table });
    setInvitees((list) => [guest, ...list]);
    return guest;
  }, []);

  const updateInvitee = useCallback(async (id, patch) => {
    const updated = await apiUpdateInvitee(id, patch);
    setInvitees((list) => list.map((g) => (g.id === id ? updated : g)));
    return updated;
  }, []);

  const deleteInvitee = useCallback(async (id) => {
    await apiDeleteInvitee(id);
    setInvitees((list) => list.filter((g) => g.id !== id));
  }, []);

  const getInvitee = useCallback(
    (id) => invitees.find((g) => g.id === id) || null,
    [invitees],
  );

  /** Marque un invite present. Renvoie un statut pour piloter l'UI du scanner. */
  const markPresent = useCallback(async (id) => {
    const { outcome, invitee } = await checkinInvitee(id);
    setInvitees((list) => list.map((g) => (g.id === id ? invitee : g)));
    return { outcome: outcome === "ok" ? "ok" : "deja_present", guest: invitee };
  }, []);

  /** Decode un QR scanne et resout l'invite correspondant cote serveur (atomique, ScannerPage.jsx). */
  const resolveScannedCode = useCallback(async (raw) => {
    const data = decodeGuestPayload(raw);
    if (!data) return { outcome: "invalide" };
    try {
      const guest = await apiGetInvitee(data.id);
      return { outcome: "trouve", guest };
    } catch {
      return { outcome: "introuvable" };
    }
  }, []);

  const value = {
    invitees,
    loading,
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
