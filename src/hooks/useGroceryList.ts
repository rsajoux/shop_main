"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { MOCK_COLLABORATORS } from "@/constants/grocery";
import { loadGroceryState, saveGroceryState } from "@/lib/local-storage";
import { addItemSchema } from "@/lib/validation";
import type {
  AddItemFormValues,
  CollaborationEvent,
  GroceryItem,
  GroceryState,
  PendingOperation
} from "@/types/grocery";

interface UseGroceryListParams {
  isOnline: boolean;
}

interface VoiceParseResult {
  parsed?: AddItemFormValues;
  error?: string;
}

const createId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getActorName = (collaboratorId: string) => {
  return MOCK_COLLABORATORS.find((collaborator) => collaborator.id === collaboratorId)?.name ?? "You";
};

const parseVoiceInput = (voiceText: string): VoiceParseResult => {
  const normalized = voiceText.trim().toLowerCase();
  const regex = /(?:agregar|add)\s+(\d{1,2})?\s*([a-zA-Z\s]+)/;
  const match = normalized.match(regex);

  if (!match) {
    return { error: "Voice command not recognized. Try: 'add 2 apples'" };
  }

  const quantity = match[1] ? Number(match[1]) : 1;
  const name = match[2]?.trim();
  if (!name) {
    return { error: "Voice command needs an item name." };
  }

  return {
    parsed: {
      name,
      quantity,
      category: "other"
    }
  };
};

const upsertItem = (items: GroceryItem[], newItem: GroceryItem) => {
  return items.map((item) => (item.id === newItem.id ? newItem : item));
};

export const useGroceryList = ({ isOnline }: UseGroceryListParams) => {
  const [state, setState] = useState<GroceryState>(() => loadGroceryState());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const persist = (nextState: GroceryState) => {
    setState(nextState);
    saveGroceryState(nextState);
  };

  const appendEvent = (message: string, actor?: string): CollaborationEvent => ({
    id: createId(),
    actor: actor ?? getActorName(state.collaboratorId),
    message,
    createdAt: new Date().toISOString()
  });

  const enqueueWhenOffline = (description: string, nextState: GroceryState): GroceryState => {
    if (isOnline) {
      return nextState;
    }
    const operation: PendingOperation = {
      id: createId(),
      description,
      createdAt: new Date().toISOString()
    };
    return {
      ...nextState,
      pendingQueue: [operation, ...nextState.pendingQueue]
    };
  };

  const addItem = (values: AddItemFormValues) => {
    const parsed = addItemSchema.safeParse(values);
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? "Invalid item.");
      return;
    }

    const actor = getActorName(state.collaboratorId);
    const item: GroceryItem = {
      id: createId(),
      checked: false,
      updatedAt: new Date().toISOString(),
      updatedBy: actor,
      ...parsed.data
    };

    let nextState: GroceryState = {
      ...state,
      items: [item, ...state.items],
      events: [appendEvent(`added ${item.name}`), ...state.events]
    };

    nextState = enqueueWhenOffline(`Add ${item.name}`, nextState);
    persist(nextState);
    setErrorMessage(null);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = state.items.find((currentItem) => currentItem.id === itemId);
    if (!item) return;

    const parsed = addItemSchema.safeParse({
      name: item.name,
      category: item.category,
      quantity
    });

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? "Invalid quantity.");
      return;
    }

    const actor = getActorName(state.collaboratorId);
    const updated = { ...item, quantity, updatedBy: actor, updatedAt: new Date().toISOString() };
    let nextState: GroceryState = {
      ...state,
      items: upsertItem(state.items, updated),
      events: [appendEvent(`updated quantity of ${item.name} to ${quantity}`), ...state.events]
    };
    nextState = enqueueWhenOffline(`Update quantity for ${item.name}`, nextState);
    persist(nextState);
    setErrorMessage(null);
  };

  const toggleChecked = (itemId: string) => {
    const item = state.items.find((currentItem) => currentItem.id === itemId);
    if (!item) return;

    const actor = getActorName(state.collaboratorId);
    const checkedItem = {
      ...item,
      checked: !item.checked,
      updatedBy: actor,
      updatedAt: new Date().toISOString()
    };
    let nextState: GroceryState = {
      ...state,
      items: upsertItem(state.items, checkedItem),
      events: [appendEvent(`${checkedItem.checked ? "checked" : "unchecked"} ${item.name}`), ...state.events]
    };
    nextState = enqueueWhenOffline(`Toggle ${item.name}`, nextState);
    persist(nextState);
  };

  const removeItem = (itemId: string) => {
    const item = state.items.find((currentItem) => currentItem.id === itemId);
    if (!item) return;

    let nextState: GroceryState = {
      ...state,
      items: state.items.filter((currentItem) => currentItem.id !== itemId),
      events: [appendEvent(`removed ${item.name}`), ...state.events]
    };
    nextState = enqueueWhenOffline(`Remove ${item.name}`, nextState);
    persist(nextState);
  };

  const checkoutPurchasedItems = () => {
    const purchasedItems = state.items.filter((item) => item.checked);
    if (purchasedItems.length === 0) {
      setErrorMessage("Select at least one checked item to move into history.");
      return;
    }

    const actor = getActorName(state.collaboratorId);
    const purchasedAt = new Date().toISOString();
    const historyItems = purchasedItems.map((item) => ({
      id: createId(),
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      purchasedBy: actor,
      purchasedAt
    }));

    let nextState: GroceryState = {
      ...state,
      items: state.items.filter((item) => !item.checked),
      history: [...historyItems, ...state.history],
      events: [appendEvent(`checked out ${purchasedItems.length} items`), ...state.events]
    };
    nextState = enqueueWhenOffline(`Checkout ${purchasedItems.length} items`, nextState);
    persist(nextState);
    setErrorMessage(null);
  };

  const restoreHistoryItem = (historyId: string) => {
    const historyItem = state.history.find((item) => item.id === historyId);
    if (!historyItem) return;

    addItem({
      name: historyItem.name,
      quantity: historyItem.quantity,
      category: historyItem.category
    });
  };

  const setCollaborator = (collaboratorId: string) => {
    const collaboratorName = getActorName(collaboratorId);
    const nextState: GroceryState = {
      ...state,
      collaboratorId,
      events: [appendEvent(`switched active collaborator to ${collaboratorName}`, "System"), ...state.events]
    };
    persist(nextState);
  };

  const clearError = () => setErrorMessage(null);

  const applyOfflineQueue = () => {
    if (!isOnline || state.pendingQueue.length === 0) {
      return;
    }
    const nextState: GroceryState = {
      ...state,
      events: [appendEvent(`synced ${state.pendingQueue.length} queued changes`, "System"), ...state.events],
      pendingQueue: []
    };
    persist(nextState);
  };

  const addFromVoice = (voiceText: string) => {
    const voiceResult = parseVoiceInput(voiceText);
    if (voiceResult.error) {
      setErrorMessage(voiceResult.error);
      return;
    }
    addItem(voiceResult.parsed as AddItemFormValues);
  };

  const { data: historySuggestions } = useQuery({
    queryKey: ["history-suggestions", state.history],
    queryFn: async () => {
      const uniqueNames = Array.from(new Set(state.history.map((item) => item.name))).slice(0, 5);
      return uniqueNames;
    }
  });

  const checkedCount = useMemo(() => {
    return state.items.reduce((total, item) => total + (item.checked ? 1 : 0), 0);
  }, [state.items]);

  return {
    state,
    checkedCount,
    errorMessage,
    historySuggestions: historySuggestions ?? [],
    addItem,
    updateQuantity,
    toggleChecked,
    removeItem,
    checkoutPurchasedItems,
    restoreHistoryItem,
    setCollaborator,
    applyOfflineQueue,
    addFromVoice,
    clearError
  };
};
