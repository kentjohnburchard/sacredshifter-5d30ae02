
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);
  
  useEffect(() => {
    if (!effectiveAudioUrl) {
      console.warn("No audio URL provided to FrequencyPlayer");
      return;
    } else {
      console.log("FrequencyPlayer using audio URL:", effectiveAudioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = effectiveAudioUrl;
        audioRef.current.load();
      }
    }
  }, [effectiveAudioUrl]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Could not play audio. Click the play button to try again.");
          // Reset play state without triggering the callback
          if (onPlayToggle) {
            onPlayToggle();
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, onPlayToggle]);

  const handleButtonClick = () => {
    onPlayToggle();
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={handleButtonClick}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
    </div>
  );
};

export default FrequencyPlayer;
