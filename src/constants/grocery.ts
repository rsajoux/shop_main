import type { GroceryCategory, GroceryState, MockCollaborator } from "@/types/grocery";

export const GROCERY_STORAGE_KEY = "shop-main:grocery-state:v1";
export const GROCERY_MAX_QUANTITY = 99;

export const GROCERY_CATEGORIES: Array<{ value: GroceryCategory; label: string }> = [
  { value: "produce", label: "Produce" },
  { value: "dairy", label: "Dairy" },
  { value: "meat", label: "Meat" },
  { value: "bakery", label: "Bakery" },
  { value: "frozen", label: "Frozen" },
  { value: "pantry", label: "Pantry" },
  { value: "other", label: "Other" }
];

export const MOCK_COLLABORATORS: MockCollaborator[] = [
  { id: "u-1", name: "You" },
  { id: "u-2", name: "Ana" },
  { id: "u-3", name: "Leo" }
];

export const INITIAL_GROCERY_STATE: GroceryState = {
  collaboratorId: MOCK_COLLABORATORS[0].id,
  items: [
    {
      id: "item-1",
      name: "Tomatoes",
      quantity: 4,
      category: "produce",
      checked: false,
      updatedAt: new Date().toISOString(),
      updatedBy: "You"
    },
    {
      id: "item-2",
      name: "Milk",
      quantity: 1,
      category: "dairy",
      checked: false,
      updatedAt: new Date().toISOString(),
      updatedBy: "You"
    }
  ],
  history: [],
  events: [
    {
      id: "event-1",
      actor: "System",
      message: "Mock list initialized",
      createdAt: new Date().toISOString()
    }
  ],
  pendingQueue: []
};
