// Thin fetch wrapper shared by every src/api/*.js module - plays the same
// role as digisante-frontend's packages/api-client (base URL, bearer token,
// envelope unwrapping, normalized errors) but plain fetch instead of RTK
// Query, since this app has no Redux store to hang a query cache off of.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const TOKEN_STORAGE_KEY = "cj-wedding.admin-token.v1";

// Read synchronously at module load (not in a React effect) so the token is
// already available the instant any api/*.js call fires, regardless of
// which Provider's mount effect happens to run first.
let authToken = (() => {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
})();

export function getAuthToken() {
  return authToken;
}

/** Called by AuthContext on login/logout - the one place that persists the session. */
export function setAuthToken(token) {
  authToken = token;
  try {
    if (token) sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    else sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // stockage indisponible (navigation privee, quota) - on ignore
  }
}

let unauthorizedHandler = null;
/** Called by AuthContext so a 401 (expired/invalid session) logs the admin out everywhere, not just on the request that happened to fail. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "NETWORK_ERROR",
      "NETWORK_ERROR",
      "Impossible de contacter le serveur. Vérifiez votre connexion.",
    );
  }

  const text = await response.text();
  let envelope = null;
  if (text) {
    try {
      envelope = JSON.parse(text);
    } catch {
      throw new ApiError(response.status, "PARSING_ERROR", "Réponse du serveur illisible.");
    }
  }

  if (!response.ok) {
    if (response.status === 401) unauthorizedHandler?.();
    const error = envelope?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? "Une erreur inattendue est survenue.",
    );
  }

  return envelope?.data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
