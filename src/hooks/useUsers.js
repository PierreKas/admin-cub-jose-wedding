import { useContext } from "react";
import { UsersContext } from "../context/usersContextObject";

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
};
