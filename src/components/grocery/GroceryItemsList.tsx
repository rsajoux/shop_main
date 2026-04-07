"use client";

import { Trash2 } from "lucide-react";

import { GROCERY_CATEGORIES } from "@/constants/grocery";
import type { GroceryItem } from "@/types/grocery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GroceryItemsListProps {
  items: GroceryItem[];
  onToggleChecked: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const GroceryItemsList = ({
  items,
  onToggleChecked,
  onUpdateQuantity,
  onRemoveItem
}: GroceryItemsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[24px_1fr_90px_120px_40px] items-center gap-2 rounded-md border p-2"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggleChecked(item.id)}
                aria-label={`Toggle ${item.name}`}
              />
              <div>
                <p className={item.checked ? "line-through text-muted-foreground" : ""}>{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {GROCERY_CATEGORIES.find((category) => category.value === item.category)?.label ?? "Other"}
                </p>
              </div>
              <Input
                type="number"
                min={1}
                max={99}
                value={item.quantity}
                onChange={(event) => onUpdateQuantity(item.id, Number(event.target.value))}
              />
              <p className="text-xs text-muted-foreground">By {item.updatedBy}</p>
              <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
