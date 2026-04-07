"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VoiceMockPanelProps {
  onSubmitVoice: (voiceText: string) => void;
}

export const VoiceMockPanel = ({ onSubmitVoice }: VoiceMockPanelProps) => {
  const [voiceText, setVoiceText] = useState("");

  const handleSubmit = () => {
    onSubmitVoice(voiceText);
    setVoiceText("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Command (Mock)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Example: <span className="font-medium">add 2 apples</span>
        </p>
        <div className="flex gap-2">
          <Input value={voiceText} onChange={(event) => setVoiceText(event.target.value)} />
          <Button type="button" onClick={handleSubmit}>
            Parse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
