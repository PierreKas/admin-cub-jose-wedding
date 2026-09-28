import React from "react";
import { CheckCircle2, Clock3, User, Users } from "lucide-react";

export const StatusPill = ({ status }) => {
  const present = status === "present";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        present
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {present ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <Clock3 className="w-3.5 h-3.5" />
      )}
      {present ? "Présent" : "En attente"}
    </span>
  );
};

export const TypeTag = ({ type }) => {
  const couple = type === "couple";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-chocolate/10 text-chocolate">
      {couple ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      {couple ? "Couple" : "Célibataire"}
    </span>
  );
};
