
import React, { useEffect } from "react";
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
  
  useEffect(() => {
    if (!effectiveAudioUrl) {
      console.warn("No audio URL provided to FrequencyPlayer");
    } else {
      console.log("FrequencyPlayer using audio URL:", effectiveAudioUrl);
    }
  }, [effectiveAudioUrl]);
  
  const handlePlayStateChange = (newPlayState: boolean) => {
    // Only call onPlayToggle if the state actually changed
    if (newPlayState !== isPlaying) {
      console.log("Play state changed:", newPlayState, "for URL:", effectiveAudioUrl);
      onPlayToggle();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={onPlayToggle}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      
      <RandomizingAudioPlayer
        audioUrl={effectiveAudioUrl}
        frequency={frequency}
        groupId={groupId}
        onPlayStateChange={handlePlayStateChange}
        autoPlay={isPlaying}
        showControls={false}
      />
    </div>
  );
};

export default FrequencyPlayer;
