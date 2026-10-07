import { useContext } from "react";
import { DrinksContext } from "../context/drinksContextObject";

export const useDrinks = () => {
  const ctx = useContext(DrinksContext);
  if (!ctx) throw new Error("useDrinks must be used within DrinksProvider");
  return ctx;
};
