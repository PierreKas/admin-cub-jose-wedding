import { createContext } from "react";

// Objet de contexte isole dans son propre fichier (pas de JSX ici) afin que
// UsersContext.jsx (le Provider) et hooks/useUsers.js (le hook) puissent
// tous deux l'importer sans faire d'un export "mixte" pour fast-refresh.
export const UsersContext = createContext(null);
