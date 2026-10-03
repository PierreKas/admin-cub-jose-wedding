import { api } from "./apiClient";

export const listUsers = () => api.get("/api/users");
export const createUser = (payload) => api.post("/api/users", payload);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
