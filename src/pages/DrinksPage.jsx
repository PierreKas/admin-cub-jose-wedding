import React from "react";
import ManagedListPage from "../components/ManagedListPage";
import { useDrinks } from "../hooks/useDrinks";
import { useInvitees } from "../hooks/useInvitees";

const DrinksPage = () => {
  const { invitees } = useInvitees();
  const countFor = (name) => invitees.filter((g) => g.drink === name).length;

  return (
    <ManagedListPage
      title="Boissons"
      subtitle="Gérez la liste des boissons proposées. Chaque invité choisit la sienne depuis son invitation."
      placeholder="Ex : Jus d'ananas"
      emptyLabel="Aucune boisson pour le moment. Ajoutez-en une ci-dessus."
      useStore={useDrinks}
      renderExtra={(item) => {
        const n = countFor(item.name);
        return (
          <p className="text-xs text-secondary/50 mt-0.5">
            Choisie par {n} invité{n > 1 ? "s" : ""}
          </p>
        );
      }}
    />
  );
};

export default DrinksPage;
