"use client";

import { formatDistanceToNow } from "date-fns";

import { MOCK_COLLABORATORS } from "@/constants/grocery";
import type { CollaborationEvent } from "@/types/grocery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface CollaborationPanelProps {
  collaboratorId: string;
  events: CollaborationEvent[];
  onChangeCollaborator: (collaboratorId: string) => void;
}

export const CollaborationPanel = ({
  collaboratorId,
  events,
  onChangeCollaborator
}: CollaborationPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration (Mock)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="mb-1 text-sm font-medium">Active collaborator</p>
          <Select value={collaboratorId} onChange={(event) => onChangeCollaborator(event.target.value)}>
            {MOCK_COLLABORATORS.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="max-h-48 space-y-2 overflow-auto">
          {events.slice(0, 8).map((event) => (
            <div key={event.id} className="rounded-md border p-2 text-xs">
              <p>
                <span className="font-medium">{event.actor}</span> {event.message}
              </p>
              <p className="text-muted-foreground">
                {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
