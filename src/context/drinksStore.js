import { createListStore } from "./createListStore.jsx";
import { drinksApi } from "../api/drinksApi";

export const drinksStore = createListStore(drinksApi);
