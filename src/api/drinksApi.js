import { api } from "./apiClient";
import { createNamedListApi } from "./namedListApi";

export const drinksApi = createNamedListApi("/api/drinks");

/** PublicInvitationPage.jsx reads this (no auth) to render the drink-choice pills for a guest. */
export const listPublicDrinks = () => api.get("/api/public/drinks", { auth: false });
