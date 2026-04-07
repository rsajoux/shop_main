"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OfflineStatusProps {
  isOnline: boolean;
  pendingCount: number;
  onSync: () => void;
}

export const OfflineStatus = ({ isOnline, pendingCount, onSync }: OfflineStatusProps) => {
  if (isOnline) {
    return (
      <div className="flex items-center justify-between rounded-md border p-3">
        <Badge>Online</Badge>
        {pendingCount > 0 ? (
          <Button variant="secondary" size="sm" onClick={onSync}>
            Sync {pendingCount} queued changes
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">Everything is synced.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-red-300 bg-red-50 p-3">
      <Badge variant="destructive">Offline</Badge>
      <p className="text-sm text-red-700">
        Changes are queued locally ({pendingCount}) and will sync when online.
      </p>
    </div>
  );
};
