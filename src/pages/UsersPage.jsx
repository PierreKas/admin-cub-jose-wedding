import React, { useState } from "react";
import { Plus, ShieldCheck, Trash2, UserCog } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

const ROLE_LABELS = { ADMIN: "Administrateur", PROTOCOL: "Protocole" };

const UsersPage = () => {
  const { users, loading, addUser, deleteUser } = useUsers();
  const { username: currentUsername } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PROTOCOL");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError("");
    setSubmitting(true);
    try {
      await addUser({ username, password, role });
      setUsername("");
      setPassword("");
      setRole("PROTOCOL");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (user) => {
    if (!window.confirm(`Supprimer l'utilisateur "${user.username}" ?`)) return;
    try {
      await deleteUser(user.id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes qui peuvent se connecter - administrateurs (accès complet) et protocole (scanner uniquement)."
      />

      <form
        onSubmit={onAdd}
        className="max-w-xl bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-6 sm:p-8 space-y-5 mb-8"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-2">
            Identifiant
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ex : protocole1"
            className="w-full rounded-lg border border-beige-dark bg-beige/40 px-4 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 caractères minimum"
            className="w-full rounded-lg border border-beige-dark bg-beige/40 px-4 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-3">
            Rôle
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 transition-colors ${
                role === "ADMIN"
                  ? "border-chocolate bg-chocolate/5"
                  : "border-beige-dark text-secondary/60"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold">Administrateur</span>
              <span className="text-[11px] text-secondary/50">Accès complet</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("PROTOCOL")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 transition-colors ${
                role === "PROTOCOL"
                  ? "border-chocolate bg-chocolate/5"
                  : "border-beige-dark text-secondary/60"
              }`}
            >
              <UserCog className="w-5 h-5" />
              <span className="text-sm font-semibold">Protocole</span>
              <span className="text-[11px] text-secondary/50">Scanner uniquement</span>
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-chocolate text-cream font-semibold py-3 rounded-full hover:bg-chocolate-dark transition-colors duration-200 disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {submitting ? "Création..." : "Créer l'utilisateur"}
        </button>
      </form>

      {loading ? (
        <p className="text-secondary/50 text-sm">Chargement...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-cream rounded-xl border border-beige-dark/60 p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-chocolate/10 text-chocolate font-semibold flex items-center justify-center text-sm shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-secondary truncate">{user.username}</p>
                  <p className="text-xs text-secondary/50">{ROLE_LABELS[user.role] || user.role}</p>
                </div>
              </div>
              <button
                onClick={() => onDelete(user)}
                disabled={user.username === currentUsername}
                aria-label="Supprimer"
                title={user.username === currentUsername ? "Impossible de supprimer votre propre compte" : undefined}
                className="p-1.5 rounded-lg text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
