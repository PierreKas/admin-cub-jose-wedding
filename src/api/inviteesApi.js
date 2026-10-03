import { api } from "./apiClient";

export const listInvitees = () => api.get("/api/invitees");
export const getInvitee = (id) => api.get(`/api/invitees/${id}`);
export const createInvitee = (payload) => api.post("/api/invitees", payload);
export const updateInvitee = (id, payload) => api.put(`/api/invitees/${id}`, payload);
export const deleteInvitee = (id) => api.delete(`/api/invitees/${id}`);
/** Atomic server-side "mark present" - see backend/.../InviteeRepository.markPresentIfPending. Resolves to { outcome: "ok" | "deja_present", invitee }. */
export const checkinInvitee = (id) => api.post(`/api/invitees/${id}/checkin`);

export const getPublicInvitee = (id) => api.get(`/api/public/invitees/${id}`, { auth: false });
export const choosePublicDrink = (id, drink) =>
  api.patch(`/api/public/invitees/${id}/drink`, { drink }, { auth: false });
