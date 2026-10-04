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
  // Civil, religieux et réception se tiennent tous le même jour désormais -
  // civil n'est plus une cérémonie à part sur une autre date (voir l'ancien
  // champ `note` qui le précisait).
  program: [
    {
      title: "Mariage Civil",
      place: "Hôtel de Ville de Kinshasa",
      time: "09H00",
    },
    {
      title: "Mariage Religieux",
      place: "Paroisse Sainte-Thérèse",
      time: "12H30",
    },
    {
      title: "Prise des Vues",
      place: "Jardin des Palmiers",
      time: "15H00",
    },
    {
      title: "Réception des Invités",
      place: "Salle de fête Le Chocolat",
      time: "17H00",
    },
  ],
  note: "",
  contacts: ["+243 900 000 001", "+243 900 000 002"],
};
