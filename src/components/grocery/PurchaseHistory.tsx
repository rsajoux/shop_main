"use client";

import { format } from "date-fns";

import type { PurchaseHistoryItem } from "@/types/grocery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseHistoryProps {
  history: PurchaseHistoryItem[];
  suggestions: string[];
  onRestoreItem: (historyId: string) => void;
}

export const PurchaseHistory = ({ history, suggestions, onRestoreItem }: PurchaseHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length > 0 && (
          <div className="rounded-md border p-2 text-sm">
            Suggested from history: {suggestions.join(", ")}
          </div>
        )}
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history yet.</p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm"
            >
              <div>
                <p>
                  {item.quantity}x {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.purchasedBy} - {format(new Date(item.purchasedAt), "PPp")}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => onRestoreItem(item.id)}>
                Add Again
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
