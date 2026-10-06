import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, QrCode, UserPlus, Users } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { StatusPill, TypeTag } from "../components/Badges";
import { useInvitees } from "../hooks/useInvitees";
import { useTables } from "../hooks/useTables";
import { wedding } from "../constants/wedding";

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="bg-cream rounded-2xl p-6 shadow-sm border border-beige-dark/60">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tint}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <p className="font-display text-3xl font-bold text-secondary">{value}</p>
    <p className="text-secondary/60 text-sm mt-1">{label}</p>
  </div>
);

const DashboardPage = () => {
  const { invitees, loading } = useInvitees();
  const { items: tables } = useTables();

  const total = invitees.length;
  const presents = invitees.filter((g) => g.status === "present").length;
  const attente = total - presents;
  const couples = invitees.filter((g) => g.type === "couple").length;
  const singles = total - couples;
  // Un "couple" compte pour 2 personnes - c'est le nombre de personnes
  // attendues qui importe le plus, pas le nombre de fiches/invitations.
  const expectedGuests = invitees.reduce(
    (sum, g) => sum + (g.type === "couple" ? 2 : 1),
    0,
  );
  const tauxPresence = total ? Math.round((presents / total) * 100) : 0;
  const recent = invitees.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Suivi des invitations pour le mariage de ${wedding.groom} & ${wedding.bride}.`}
        action={
          <Link
            to="/admin/invites/nouveau"
            className="inline-flex items-center gap-2 bg-chocolate text-cream px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-chocolate-dark transition-colors duration-200"
          >
            <UserPlus className="w-4 h-4" />
            Nouvel invité
          </Link>
        }
      />

      {loading && (
        <p className="text-secondary/50 text-sm mb-6">Chargement...</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={Users}
          label="Invités enregistrés"
          value={expectedGuests}
          tint="bg-chocolate/10 text-chocolate"
        />
        <StatCard
          icon={CheckCircle2}
          label="Présents"
          value={presents}
          tint="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={Clock3}
          label="En attente"
          value={attente}
          tint="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={QrCode}
          label="Taux de présence"
          value={`${tauxPresence}%`}
          tint="bg-accent/20 text-chocolate"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-secondary">
              Derniers invités ajoutés
            </h2>
            <Link
              to="/admin/invites"
              className="text-sm font-semibold text-chocolate hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-beige-dark/50">
            {recent.map((g) => (
              <Link
                key={g.id}
                to={`/admin/invites/${g.id}`}
                className="flex items-center justify-between py-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-chocolate/10 text-chocolate font-semibold flex items-center justify-center text-sm shrink-0">
                    {g.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-secondary truncate group-hover:text-chocolate">
                      {g.name}
                    </p>
                    <TypeTag type={g.type} />
                  </div>
                </div>
                <StatusPill status={g.status} />
              </Link>
            ))}
            {recent.length === 0 && (
              <p className="text-secondary/50 text-sm py-6 text-center">
                Aucun invité pour le moment.
              </p>
            )}
          </div>
        </div>

        <div className="bg-chocolate-dark text-cream rounded-2xl shadow-sm p-6">
          <h2 className="font-display text-lg font-bold mb-4">Répartition</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-cream/70">Invitations couple</span>
              <span className="font-semibold">{couples}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream/70">Invitations individuelles</span>
              <span className="font-semibold">{singles}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-cream/70">Invitations enregistrées</span>
              <span className="font-semibold">{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream/70">Tables enregistrées</span>
              <span className="font-semibold">{tables.length}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-cream/70">Invités attendus (total)</span>
              <span className="font-semibold text-accent">
                {expectedGuests}
              </span>
            </div>
          </div>
          <Link
            to="/admin/scanner"
            className="mt-6 flex items-center justify-center gap-2 bg-accent text-chocolate-dark font-semibold text-sm py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <QrCode className="w-4 h-4" />
            Ouvrir le scanner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
