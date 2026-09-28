import { useContext } from "react";
import { InviteesContext } from "../context/inviteesContextObject";

export const useInvitees = () => {
  const ctx = useContext(InviteesContext);
  if (!ctx) throw new Error("useInvitees must be used within InviteesProvider");
  return ctx;
};
