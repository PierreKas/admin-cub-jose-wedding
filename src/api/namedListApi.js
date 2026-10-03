import { api } from "./apiClient";

/** Tables and drinks are the same { id, name, createdAt } CRUD shape on the backend too (AbstractNamedItemController) - one factory instead of two copies, mirroring context/createListStore.jsx. */
export function createNamedListApi(basePath) {
  return {
    list: () => api.get(basePath),
    create: (name) => api.post(basePath, { name }),
    rename: (id, name) => api.put(`${basePath}/${id}`, { name }),
    remove: (id) => api.delete(`${basePath}/${id}`),
  };
}
