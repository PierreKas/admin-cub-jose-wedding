import React, { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, User, Users } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useInvitees } from "../hooks/useInvitees";

const CIVILITIES = ["", "Mme", "Mr", "Rév", "Hon"];

const InviteeFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { getInvitee, addInvitee, updateInvitee } = useInvitees();
  const existing = isEdit ? getInvitee(id) : null;
  const navigate = useNavigate();

  const [civility, setCivility] = useState(existing?.civility ?? "");
  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? "single");
  const [error, setError] = useState("");

  if (isEdit && !existing) return <Navigate to="/admin/invites" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom de l'invité est obligatoire.");
      return;
    }
    if (isEdit) {
      updateInvitee(existing.id, { civility, name: name.trim(), type });
      navigate(`/admin/invites/${existing.id}`);
    } else {
      const guest = addInvitee({ civility, name, type });
      navigate(`/admin/invites/${guest.id}`);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-chocolate hover:gap-3 transition-all mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <PageHeader
        title={isEdit ? "Modifier l'invité" : "Nouvel invité"}
        subtitle="Un QR code unique sera généré automatiquement pour cet invité et incrusté sur son invitation."
      />

      <form
        onSubmit={onSubmit}
        className="max-w-xl bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-6 sm:p-8 space-y-6"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-2">
            Civilité (optionnel)
          </label>
          <select
            value={civility}
            onChange={(e) => setCivility(e.target.value)}
            className="w-full rounded-lg border border-beige-dark bg-beige/40 px-4 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
          >
            {CIVILITIES.map((c) => (
              <option key={c} value={c}>
                {c || "Aucune"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-2">
            Nom complet de l'invité
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Jean-Pierre Mumbere"
            autoFocus
            className="w-full rounded-lg border border-beige-dark bg-beige/40 px-4 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
          />
          {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-3">
            Type d'invitation
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("single")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 transition-colors ${
                type === "single"
                  ? "border-chocolate bg-chocolate/5"
                  : "border-beige-dark text-secondary/60"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-semibold">Célibataire</span>
              <span className="text-[11px] text-secondary/50">1 personne</span>
            </button>
            <button
              type="button"
              onClick={() => setType("couple")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 transition-colors ${
                type === "couple"
                  ? "border-chocolate bg-chocolate/5"
                  : "border-beige-dark text-secondary/60"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm font-semibold">Couple</span>
              <span className="text-[11px] text-secondary/50">2 personnes</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-chocolate text-cream font-semibold py-3 rounded-full hover:bg-chocolate-dark transition-colors duration-200"
        >
          {isEdit ? "Enregistrer les modifications" : "Générer l'invitation"}
        </button>
      </form>
    </div>
  );
};

export default InviteeFormPage;
