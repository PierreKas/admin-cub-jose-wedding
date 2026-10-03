import React, { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import PageHeader from "./PageHeader";

/**
 * Page generique "liste nommee geree par l'admin" (ajouter / renommer /
 * supprimer) - utilisee pour les boissons et les tables, qui partagent la
 * meme forme (juste un nom).
 */
const ManagedListPage = ({
  title,
  subtitle,
  placeholder,
  emptyLabel,
  useStore,
  renderExtra,
}) => {
  const { items, loading, add, update, remove } = useStore();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const onAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError("");
    try {
      await add(newName);
      setNewName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.name);
    setError("");
  };

  const commitEdit = async () => {
    if (!editValue.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await update(editingId, { name: editValue.trim() });
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
      <PageHeader title={title} subtitle={subtitle} />

      <form
        onSubmit={onAdd}
        className="flex flex-col sm:flex-row gap-3 mb-8 max-w-xl"
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-beige-dark bg-cream px-5 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-chocolate text-cream px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-chocolate-dark transition-colors duration-200 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </form>

      {error && <p className="text-red-600 text-xs -mt-5 mb-6">{error}</p>}

      {loading ? (
        <p className="text-secondary/50 text-sm">Chargement...</p>
      ) : items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-cream rounded-xl border border-beige-dark/60 p-4 flex items-center justify-between gap-3"
            >
              {editingId === item.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  className="flex-1 min-w-0 rounded-lg border border-chocolate bg-beige/40 px-3 py-1.5 text-sm text-secondary outline-none"
                />
              ) : (
                <div className="min-w-0">
                  <p className="font-semibold text-secondary truncate">
                    {item.name}
                  </p>
                  {renderExtra && renderExtra(item)}
                </div>
              )}

              <div className="flex items-center gap-1 shrink-0">
                {editingId === item.id ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(item)}
                      aria-label="Renommer"
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-cream rounded-2xl border border-dashed border-beige-dark max-w-4xl">
          <p className="text-secondary/60">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
};

export default ManagedListPage;
