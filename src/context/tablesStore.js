import { createListStore } from "./createListStore.jsx";
import { tablesApi } from "../api/tablesApi";

export const tablesStore = createListStore(tablesApi);
