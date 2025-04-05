
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface FrequencyPlayerProps {
  audioUrl?: string; // Make audioUrl optional
  url?: string; // Add support for the url field
  isPlaying: boolean;
  onPlayToggle: () => void;
  frequency?: number; // Optional frequency prop
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  url, // New prop
  isPlaying,
  onPlayToggle,
  frequency
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Prioritize URL, fallback to audioUrl
  const effectiveAudioUrl = url || audioUrl;
  
  // Format the audio URL to ensure it's a proper URL
  const formatAudioUrl = (inputUrl: string): string => {
    if (!inputUrl) return '';
    
    // If it's already a proper URL with http/https, return as is
    if (inputUrl.startsWith('http://') || inputUrl.startsWith('https://')) {
      return inputUrl;
    }
    
    // If it's a path to a file from Pixabay, fix the URL
    if (inputUrl.includes('pixabay.com') || inputUrl.includes('/music/')) {
      // Make sure there's no leading slash in the path
      const path = inputUrl.startsWith('/') ? inputUrl.substring(1) : inputUrl;
      return `https://cdn.pixabay.com/download/audio/${path}`;
    }
    
    // For other URLs, assume they're relative to the app's root
    return inputUrl;
  };
  
  // Initialize or update the audio element when audioUrl changes
  useEffect(() => {
    if (!effectiveAudioUrl) {
      console.error("No audio URL provided to FrequencyPlayer");
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Format the URL correctly
    const formattedUrl = formatAudioUrl(effectiveAudioUrl);
    console.log("Formatted audio URL:", formattedUrl);
    
    // Create a new audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    // Add event listeners
    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio ready to play:", formattedUrl);
    };
    
    const handleError = (err: Event) => {
      console.error("Audio error:", err);
      setHasError(true);
      setIsLoading(false);
      toast.error(`Failed to load audio file: ${formattedUrl}`);
    };
    
    // Handle ended event
    const handleEnded = () => {
      console.log("Audio playback ended");
      onPlayToggle(); // Reset playing state when audio ends
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);
    
    // Set the audio source and load it
    audio.src = formattedUrl;
    audio.load();
    
    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [effectiveAudioUrl, onPlayToggle]);
  
  // Handle play/pause toggling
  useEffect(() => {
    if (!audioRef.current || hasError) return;
    
    if (isPlaying) {
      console.log("Attempting to play audio:", audioRef.current.src);
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          // Don't automatically toggle state here - let the parent handle it
          toast.error("Unable to play audio. Please try again.");
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, hasError]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={isLoading || hasError}
        className={`h-10 w-10 rounded-full ${hasError ? 'bg-red-100' : 'border-white/20 bg-white/10'} text-white hover:bg-white/20 hover:text-white ${isLoading ? 'opacity-50' : ''}`}
        onClick={() => {
          if (!isLoading && !hasError) {
            onPlayToggle();
          }
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      {frequency && (
        <span className="text-xs text-white/70">{frequency}Hz</span>
      )}
    </div>
  );
};

export default FrequencyPlayer;
