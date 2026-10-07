import React from "react";
import ManagedListPage from "../components/ManagedListPage";
import { useTables } from "../hooks/useTables";
import { useInvitees } from "../hooks/useInvitees";
import { useAuth } from "../hooks/useAuth";

const TABLE_CAPACITY = 10;

const TablesPage = () => {
  const { invitees } = useInvitees();
  const { role } = useAuth();
  const countFor = (name) => invitees.filter((g) => g.table === name).length;
  // Sieges reels (un "couple" occupe 2 places) - meme logique de capacite
  // que InviteeFormPage.jsx et le backend (InviteeService.checkTableCapacity).
  const seatsFor = (name) =>
    invitees
      .filter((g) => g.table === name)
      .reduce((sum, g) => sum + (g.type === "couple" ? 2 : 1), 0);

  return (
    <ManagedListPage
      title="Tables"
      subtitle="Gérez les tables disponibles pour la réception. Assignez ensuite chaque invité à une table depuis sa fiche."
      placeholder="Ex : Madagascar"
      emptyLabel="Aucune table pour le moment. Ajoutez-en une ci-dessus."
      useStore={useTables}
      readOnly={role === "CO_ADMIN"}
      filters={[
        { key: "toutes", label: "Toutes", predicate: () => true },
        { key: "vides", label: "Vides", predicate: (t) => countFor(t.name) === 0 },
        { key: "occupees", label: "Occupées", predicate: (t) => countFor(t.name) > 0 },
      ]}
      renderExtra={(item) => {
        const n = countFor(item.name);
        const seats = seatsFor(item.name);
        const over = seats > TABLE_CAPACITY;
        return (
          <p className={`text-xs mt-0.5 ${over ? "text-red-600 font-semibold" : "text-secondary/50"}`}>
            {n} invité{n > 1 ? "s" : ""} assigné{n > 1 ? "s" : ""} ({seats}/{TABLE_CAPACITY} places)
          </p>
        );
      }}
      flag={(item) => seatsFor(item.name) > TABLE_CAPACITY}
      flagLabel={`Au-delà de la capacité (max ${TABLE_CAPACITY})`}
    />
  );
};

export default TablesPage;
