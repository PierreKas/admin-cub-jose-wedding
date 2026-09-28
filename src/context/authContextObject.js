import { createContext } from "react";

// Objet de contexte isole dans son propre fichier (pas de JSX ici) afin que
// AuthContext.jsx (le Provider) et hooks/useAuth.js (le hook) puissent tous
// deux l'importer sans faire de fast-refresh un export "mixte".
export const AuthContext = createContext(null);
