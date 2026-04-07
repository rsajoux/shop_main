import { GROCERY_STORAGE_KEY, INITIAL_GROCERY_STATE } from "@/constants/grocery";
import type { GroceryState } from "@/types/grocery";

export const loadGroceryState = (): GroceryState => {
  if (typeof window === "undefined") {
    return INITIAL_GROCERY_STATE;
  }

  const rawValue = window.localStorage.getItem(GROCERY_STORAGE_KEY);
  if (!rawValue) {
    return INITIAL_GROCERY_STATE;
  }

  try {
    const parsed = JSON.parse(rawValue) as GroceryState;
    return parsed;
  } catch {
    return INITIAL_GROCERY_STATE;
  }
};

export const saveGroceryState = (state: GroceryState): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(state));
};
