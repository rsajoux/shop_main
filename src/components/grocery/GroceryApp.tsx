"use client";

import { useEffect, useState } from "react";

import { AddItemForm } from "@/components/grocery/AddItemForm";
import { CollaborationPanel } from "@/components/grocery/CollaborationPanel";
import { GroceryItemsList } from "@/components/grocery/GroceryItemsList";
import { OfflineStatus } from "@/components/grocery/OfflineStatus";
import { PurchaseHistory } from "@/components/grocery/PurchaseHistory";
import { VoiceMockPanel } from "@/components/grocery/VoiceMockPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGroceryList } from "@/hooks/useGroceryList";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type AppTab = "List" | "History" | "Collaboration";

export const GroceryApp = () => {
  const [activeTab, setActiveTab] = useState<AppTab>("List");
  const { isOnline } = useNetworkStatus();
  const {
    state,
    checkedCount,
    errorMessage,
    historySuggestions,
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
  } = useGroceryList({ isOnline });

  useEffect(() => {
    if (isOnline) {
      applyOfflineQueue();
    }
  }, [applyOfflineQueue, isOnline]);

  return (
    <main className="container py-8">
      <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Grocery Shopping List (Mock)</h1>
          <p className="text-sm text-muted-foreground">No auth. No DB. All data is mocked and local.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{state.items.length} items</Badge>
          <Badge>{checkedCount} checked</Badge>
        </div>
      </section>

      <div className="mb-4">
        <OfflineStatus
          isOnline={isOnline}
          pendingCount={state.pendingQueue.length}
          onSync={applyOfflineQueue}
        />
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <Button variant="ghost" size="sm" onClick={clearError}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="mb-4 flex gap-2">
        {(["List", "History", "Collaboration"] as AppTab[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "secondary"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "List" && (
        <div className="space-y-4">
          <AddItemForm onAddItem={addItem} />
          <GroceryItemsList
            items={state.items}
            onToggleChecked={toggleChecked}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
          <div className="flex justify-end">
            <Button onClick={checkoutPurchasedItems}>Checkout selected items</Button>
          </div>
        </div>
      )}

      {activeTab === "History" && (
        <PurchaseHistory
          history={state.history}
          suggestions={historySuggestions}
          onRestoreItem={restoreHistoryItem}
        />
      )}

      {activeTab === "Collaboration" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <CollaborationPanel
            collaboratorId={state.collaboratorId}
            events={state.events}
            onChangeCollaborator={setCollaborator}
          />
          <VoiceMockPanel onSubmitVoice={addFromVoice} />
        </div>
      )}
    </main>
  );
};
