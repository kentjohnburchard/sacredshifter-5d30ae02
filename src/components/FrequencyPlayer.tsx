
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface FrequencyPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  frequency?: number; // Optional frequency prop
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  isPlaying,
  onPlayToggle
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Create a new audio element if one doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      // Add event listeners
      audioRef.current.addEventListener("canplaythrough", () => {
        setIsLoading(false);
        console.log("Audio ready to play:", audioUrl);
      });
      
      audioRef.current.addEventListener("error", (err) => {
        console.error("Audio error:", err);
        setHasError(true);
        setIsLoading(false);
        toast.error("Failed to load audio file");
      });
      
      // Handle ended event
      audioRef.current.addEventListener("ended", () => {
        console.log("Audio playback ended");
        onPlayToggle();
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("canplaythrough", () => {});
        audioRef.current.removeEventListener("error", () => {});
        audioRef.current.removeEventListener("ended", () => {});
      }
    };
  }, [audioUrl, onPlayToggle]);
  
  // Handle play/pause toggling
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          onPlayToggle(); // Reset playing state on error
          toast.error("Unable to play audio. Please try again.");
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, onPlayToggle]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={isLoading || hasError}
        className={`h-10 w-10 rounded-full ${hasError ? 'bg-red-100' : 'border-white/20 bg-white/10'} text-white hover:bg-white/20 hover:text-white ${isLoading ? 'opacity-50' : ''}`}
        onClick={onPlayToggle}
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
