import React, { useState } from "react";
import { Check, GlassWater, Martini, Pencil, Plus, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useDrinks } from "../hooks/useDrinks";
import { useInvitees } from "../hooks/useInvitees";
import { useAuth } from "../hooks/useAuth";

/** Bespoke (not ManagedListPage) - drinks carry an alcoholic/non-alcoholic toggle tables don't need. */
const DrinksPage = () => {
  const { items, loading, add, update, remove } = useDrinks();
  const { invitees } = useInvitees();
  const { role } = useAuth();
  const isReadOnly = role === "CO_ADMIN";
  const countFor = (name) =>
    invitees.filter((g) => g.drink === name || g.secondDrink === name).length;

  const [newName, setNewName] = useState("");
  const [newAlcoholic, setNewAlcoholic] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAlcoholic, setEditAlcoholic] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await add({ name: newName, alcoholic: newAlcoholic });
      setNewName("");
      setNewAlcoholic(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditAlcoholic(item.alcoholic);
    setError("");
  };

  const commitEdit = async () => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await update(editingId, { name: editName.trim(), alcoholic: editAlcoholic });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.name}" ?`)) return;
    try {
      await remove(item.id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Boissons"
        subtitle="Gérez la liste des boissons proposées. Chaque invité choisit la sienne depuis son invitation."
      />

      {!isReadOnly && (
      <form
        onSubmit={onAdd}
        className="max-w-xl bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-6 sm:p-7 space-y-4 mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex : Jus d'ananas"
            className="flex-1 rounded-full border border-beige-dark bg-beige/40 px-5 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-chocolate text-cream px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-chocolate-dark transition-colors duration-200 shrink-0 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Ajout..." : "Ajouter"}
          </button>
        </div>
        <div className="flex items-center gap-2 bg-beige/40 border border-beige-dark rounded-full p-1 w-fit">
          <button
            type="button"
            onClick={() => setNewAlcoholic(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !newAlcoholic ? "bg-secondary text-cream" : "text-secondary/60 hover:text-secondary"
            }`}
          >
            Non-alcoolisée
          </button>
          <button
            type="button"
            onClick={() => setNewAlcoholic(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              newAlcoholic ? "bg-secondary text-cream" : "text-secondary/60 hover:text-secondary"
            }`}
          >
            Alcoolisée
          </button>
        </div>
      </form>
      )}

      {error && <p className="text-red-600 text-xs -mt-5 mb-6">{error}</p>}

      {loading ? (
        <p className="text-secondary/50 text-sm">Chargement...</p>
      ) : items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {items.map((item) => {
            const n = countFor(item.name);
            return (
              <div
                key={item.id}
                className="bg-cream rounded-xl border border-beige-dark/60 p-4"
              >
                {editingId === item.id ? (
                  <div className="space-y-2.5">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                      className="w-full rounded-lg border border-chocolate bg-beige/40 px-3 py-1.5 text-sm text-secondary outline-none"
                    />
                    <div className="flex items-center gap-2 bg-beige/40 border border-beige-dark rounded-full p-1 w-fit">
                      <button
                        type="button"
                        onClick={() => setEditAlcoholic(false)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          !editAlcoholic ? "bg-secondary text-cream" : "text-secondary/60"
                        }`}
                      >
                        Non-alcoolisée
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditAlcoholic(true)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          editAlcoholic ? "bg-secondary text-cream" : "text-secondary/60"
                        }`}
                      >
                        Alcoolisée
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={commitEdit}
                        aria-label="Valider"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        aria-label="Annuler"
                        className="p-1.5 rounded-lg text-secondary/50 hover:bg-beige transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-secondary truncate">{item.name}</p>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.alcoholic
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item.alcoholic ? (
                            <Martini className="w-3 h-3" />
                          ) : (
                            <GlassWater className="w-3 h-3" />
                          )}
                          {item.alcoholic ? "Alcoolisée" : "Sans alcool"}
                        </span>
                      </div>
                      <p className="text-xs text-secondary/50 mt-0.5">
                        Choisie par {n} invité{n > 1 ? "s" : ""}
                      </p>
                    </div>
                    {!isReadOnly && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(item)}
                          aria-label="Modifier"
                          className="p-1.5 rounded-lg text-secondary/50 hover:bg-beige hover:text-secondary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          aria-label="Supprimer"
                          className="p-1.5 rounded-lg text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-cream rounded-2xl border border-dashed border-beige-dark max-w-4xl">
          <p className="text-secondary/60">
            Aucune boisson pour le moment. Ajoutez-en une ci-dessus.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrinksPage;
