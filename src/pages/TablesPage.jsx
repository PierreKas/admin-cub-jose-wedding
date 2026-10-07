import React from "react";
import ManagedListPage from "../components/ManagedListPage";
import { useTables } from "../hooks/useTables";
import { useInvitees } from "../hooks/useInvitees";
import { useAuth } from "../hooks/useAuth";

const TablesPage = () => {
  const { invitees } = useInvitees();
  const { role } = useAuth();
  const countFor = (name) => invitees.filter((g) => g.table === name).length;

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
        return (
          <p className="text-xs text-secondary/50 mt-0.5">
            {n} invité{n > 1 ? "s" : ""} assigné{n > 1 ? "s" : ""}
          </p>
        );
      }}
    />
  );
};

export default TablesPage;
