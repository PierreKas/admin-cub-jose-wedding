// Informations du mariage - a personnaliser avant la mise en production.
// Ces valeurs alimentent la carte d'invitation generee pour chaque invite.

export const WEDDING_CODE = "CJ-2026";

export const wedding = {
  groom: "Christian",
  bride: "Joséphine",
  familyIntro:
    "La famille vous invite à rehausser de votre présence aux cérémonies de mariage de leurs enfants.",
  date: "Samedi 21 Novembre 2026",
  location: "Kinshasa - RD Congo",
  programLabel: "Programme des Activités",
  // Civil, religieux et soirée dansante se tiennent tous le même jour.
  program: [
    {
      title: "Mariage civil",
      place: "Commune de Ngaliema",
      time: "09H00",
    },
    {
      title: "Mariage religieux",
      place:
        "Paroisse Missionnaire de Kintambo (Av. Kwango n°7, Q. Joli-Parc, C. Ngaliema. Réf : Facebook Kintambo Magasin)",
      time: "14H00",
    },
    {
      title: "Soirée dansante",
      place:
        "Salle polyvalente Félix Antoine Tshisekedi Tshilombo. Réf : Morgue du Camp Tshatshi, en face de TASOK.",
      time: "20H00",
    },
  ],
  dressCode: "Black & Gold",
  note: "De préférence, soyez muni de votre pièce d'identité.",
  contacts: ["+243 900 000 001", "+243 900 000 002"],
};
