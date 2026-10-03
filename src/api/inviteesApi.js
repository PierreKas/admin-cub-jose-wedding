import { api } from "./apiClient";

export const listInvitees = () => api.get("/api/invitees");
export const getInvitee = (id) => api.get(`/api/invitees/${id}`);
export const createInvitee = (payload) => api.post("/api/invitees", payload);
export const updateInvitee = (id, payload) => api.put(`/api/invitees/${id}`, payload);
export const deleteInvitee = (id) => api.delete(`/api/invitees/${id}`);
/** Atomic server-side "mark present" - see backend/.../InviteeRepository.markPresentIfPending. Resolves to { outcome: "ok" | "deja_present", invitee }. */
export const checkinInvitee = (id) => api.post(`/api/invitees/${id}/checkin`);

export const getPublicInvitee = (id) => api.get(`/api/public/invitees/${id}`, { auth: false });
/** drinks: string[] - at most 1 for a "single" invitee, at most 2 for a "couple" (validated server-side against that invitee's own type). */
export const choosePublicDrinks = (id, drinks) =>
  api.patch(`/api/public/invitees/${id}/drinks`, { drinks }, { auth: false });
