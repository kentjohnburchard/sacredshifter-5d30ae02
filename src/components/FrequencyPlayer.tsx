
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface FrequencyPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  isPlaying,
  onPlayToggle
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        onClick={onPlayToggle}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      <audio
        src={audioUrl}
        autoPlay={isPlaying}
        loop
        className="hidden"
        onEnded={() => onPlayToggle()}
        onCanPlay={() => {
          const audioElement = document.querySelector('audio');
          if (audioElement && isPlaying) {
            audioElement.play().catch(err => {
              console.error("Error playing audio:", err);
            });
          }
        }}
      />
    </div>
  );
};

export default FrequencyPlayer;
