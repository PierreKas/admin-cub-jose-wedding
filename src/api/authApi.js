import { api } from "./apiClient";

export const login = (username, password) =>
  api.post("/api/auth/login", { username, password }, { auth: false });

export const fetchMe = () => api.get("/api/auth/me");
