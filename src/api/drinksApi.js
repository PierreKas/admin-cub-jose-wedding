import { api } from "./apiClient";

/**
 * Bespoke (not namedListApi's generic factory) - drinks carry an extra
 * `alcoholic` flag tables don't, so create/update need a full payload
 * object rather than a bare name string. Tables keeps using the generic
 * factory untouched (tablesApi.js).
 */
export const listDrinks = () => api.get("/api/drinks");
export const createDrink = ({ name, alcoholic }) => api.post("/api/drinks", { name, alcoholic });
export const updateDrink = (id, { name, alcoholic }) => api.put(`/api/drinks/${id}`, { name, alcoholic });
export const removeDrink = (id) => api.delete(`/api/drinks/${id}`);

/** PublicInvitationPage.jsx reads this (no auth) to render the drink-choice pills for a guest, grouped non-alcoholic first using each drink's `alcoholic` flag. */
export const listPublicDrinks = () => api.get("/api/public/drinks", { auth: false });
