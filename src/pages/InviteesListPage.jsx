import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MoreVertical,
  Pencil,
  QrCode,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { StatusPill, TypeTag } from "../components/Badges";
import SearchableSelect from "../components/SearchableSelect";
import { useInvitees } from "../hooks/useInvitees";
import { useTables } from "../hooks/useTables";
import { useAuth } from "../hooks/useAuth";

const STATUS_FILTERS = [
  { key: "tous", label: "Tous" },
  { key: "present", label: "Présents" },
  { key: "attente", label: "En attente" },
];

const TYPE_FILTERS = [
  { key: "tous", label: "Tous types" },
  { key: "single", label: "Célibataire" },
  { key: "couple", label: "Couple" },
];

const NO_TABLE = "__none__";

const InviteeCard = ({ guest }) => {
  const { deleteInvitee } = useInvitees();
  const { role } = useAuth();
  const isReadOnly = role === "CO_ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onDelete = async () => {
    setMenuOpen(false);
    if (window.confirm(`Supprimer l'invité "${guest.name}" ?`)) {
      await deleteInvitee(guest.id);
    }
  };

  return (
    <div className="relative bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <StatusPill status={guest.status} />
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-secondary/50 hover:bg-beige hover:text-secondary transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-9 z-20 w-44 bg-cream rounded-xl shadow-xl border border-beige-dark/60 overflow-hidden">
                <button
                  onClick={() => navigate(`/admin/invites/${guest.id}`)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:bg-beige"
                >
                  <QrCode className="w-4 h-4" /> Voir l'invitation
                </button>
                {!isReadOnly && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/admin/invites/${guest.id}/modifier`)
                      }
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:bg-beige"
                    >
                      <Pencil className="w-4 h-4" /> Modifier
                    </button>
                    <button
                      onClick={onDelete}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="font-display text-lg font-bold text-secondary leading-snug mb-2">
        {guest.civility ? `${guest.civility} ` : ""}
        {guest.name}
      </h3>
      <TypeTag type={guest.type} />

      <div className="mt-auto pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-chocolate/10 text-chocolate font-semibold flex items-center justify-center text-xs">
            {guest.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-xs text-secondary/50">
            {new Date(guest.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <Link
          to={`/admin/invites/${guest.id}`}
          className="w-9 h-9 rounded-full bg-secondary text-cream flex items-center justify-center hover:bg-chocolate transition-colors"
          aria-label="Voir"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

const InviteesListPage = () => {
  const { invitees, loading } = useInvitees();
  const { items: tables } = useTables();
  const { role } = useAuth();
  const isReadOnly = role === "CO_ADMIN";
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [typeFilter, setTypeFilter] = useState("tous");
  const [tableFilter, setTableFilter] = useState("");

  const counts = useMemo(
    () => ({
      tous: invitees.length,
      present: invitees.filter((g) => g.status === "present").length,
      attente: invitees.filter((g) => g.status === "attente").length,
    }),
    [invitees],
  );

  const tableOptions = useMemo(
    () => [
      { value: NO_TABLE, label: "Sans Table" },
      ...tables.map((t) => ({ value: t.name, label: t.name })),
    ],
    [tables],
  );

  const filtered = invitees.filter((g) => {
    const matchesStatus = statusFilter === "tous" || g.status === statusFilter;
    const matchesType = typeFilter === "tous" || g.type === typeFilter;
    const matchesTable =
      tableFilter === "" || (tableFilter === NO_TABLE ? g.table === "" : g.table === tableFilter);
    const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesType && matchesTable && matchesQuery;
  });

  // Un "couple" compte pour 2 personnes dans le total affiché.
  const headcount = filtered.reduce((sum, g) => sum + (g.type === "couple" ? 2 : 1), 0);

  return (
    <div>
      <PageHeader
        title="Invités"
        subtitle="Créez, modifiez et suivez la liste des invités du mariage."
        action={
          !isReadOnly && (
            <Link
              to="/admin/invites/nouveau"
              className="inline-flex items-center gap-2 bg-chocolate text-cream px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-chocolate-dark transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Nouvel invité
            </Link>
          )
        }
      />

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-secondary/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un invité"
              className="w-full rounded-full border border-beige-dark bg-cream pl-10 pr-4 py-2.5 text-sm text-secondary outline-none focus:border-chocolate"
            />
          </div>
          <div className="flex items-center gap-2 bg-cream border border-beige-dark rounded-full p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  statusFilter === f.key
                    ? "bg-secondary text-cream"
                    : "text-secondary/60 hover:text-secondary"
                }`}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>
          <span className="sm:ml-auto text-sm text-secondary/50">
            {filtered.length} invitation{filtered.length > 1 ? "s" : ""} ·{" "}
            <span className="font-semibold text-secondary">
              {headcount} personne{headcount > 1 ? "s" : ""}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-cream border border-beige-dark rounded-full p-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  typeFilter === f.key
                    ? "bg-secondary text-cream"
                    : "text-secondary/60 hover:text-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <SearchableSelect
            value={tableFilter}
            onChange={setTableFilter}
            options={tableOptions}
            allLabel="Toutes les tables"
            placeholder="Rechercher une table..."
          />
        </div>
      </div>

      {loading ? (
        <p className="text-secondary/50 text-sm">Chargement...</p>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((g) => (
            <InviteeCard key={g.id} guest={g} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream rounded-2xl border border-dashed border-beige-dark">
          <p className="text-secondary/60">Aucun invité ne correspond.</p>
        </div>
      )}
    </div>
  );
};

export default InviteesListPage;
