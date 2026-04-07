export type GroceryCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "bakery"
  | "frozen"
  | "pantry"
  | "other";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: GroceryCategory;
  checked: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface PurchaseHistoryItem {
  id: string;
  name: string;
  quantity: number;
  category: GroceryCategory;
  purchasedAt: string;
  purchasedBy: string;
}

export interface MockCollaborator {
  id: string;
  name: string;
}

export interface CollaborationEvent {
  id: string;
  actor: string;
  message: string;
  createdAt: string;
}

export interface PendingOperation {
  id: string;
  description: string;
  createdAt: string;
}

export interface GroceryState {
  items: GroceryItem[];
  history: PurchaseHistoryItem[];
  collaboratorId: string;
  events: CollaborationEvent[];
  pendingQueue: PendingOperation[];
}

export interface AddItemFormValues {
  name: string;
  quantity: number;
  category: GroceryCategory;
}
