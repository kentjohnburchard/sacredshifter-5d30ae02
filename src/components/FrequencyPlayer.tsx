
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";
import RandomizingAudioPlayer from "@/components/audio/RandomizingAudioPlayer";

interface FrequencyPlayerProps {
  audioUrl?: string;
  url?: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  frequency?: number;
  frequencyId?: string;
  id?: string;
  groupId?: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  url,
  isPlaying,
  onPlayToggle,
  frequency,
  frequencyId,
  id,
  groupId
}) => {
  const effectiveAudioUrl = url || audioUrl;
  
  const handlePlayStateChange = (newPlayState: boolean) => {
    // Only call onPlayToggle if the state actually changed
    if (newPlayState !== isPlaying) {
      onPlayToggle();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <RandomizingAudioPlayer
        audioUrl={effectiveAudioUrl}
        frequency={frequency}
        groupId={groupId}
        onPlayStateChange={handlePlayStateChange}
      />
    </div>
  );
};

export default FrequencyPlayer;
