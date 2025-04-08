
import React, { useEffect, useRef, useState } from "react";
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
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectiveAudioUrl = url || audioUrl;
  
  // Create audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleCanPlay = () => {
      console.log("Audio can play:", effectiveAudioUrl);
      setIsAudioReady(true);
      setAudioError(null);
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error("Audio load error:", e);
      setIsAudioReady(false);
      setAudioError("Failed to load audio");
      
      if (isPlaying) {
        // Notify parent that playback failed
        onPlayToggle();
        toast.error("Could not play audio. The file may be missing or in an unsupported format.");
      }
    };
    
    const handleEnded = () => {
      console.log("Audio playback ended");
      if (isPlaying) {
        onPlayToggle();
      }
    };
    
    audioRef.current.addEventListener("canplay", handleCanPlay);
    audioRef.current.addEventListener("error", handleError as EventListener);
    audioRef.current.addEventListener("ended", handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("canplay", handleCanPlay);
        audioRef.current.removeEventListener("error", handleError as EventListener);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.src = "";
      }
    };
  }, []);
  
  // Set audio source when URL changes
  useEffect(() => {
    if (!effectiveAudioUrl) {
      console.warn("No audio URL provided to FrequencyPlayer");
      return;
    }
    
    console.log("Setting audio source:", effectiveAudioUrl);
    
    if (audioRef.current) {
      // Reset state
      setIsAudioReady(false);
      setAudioError(null);
      
      // If currently playing, pause first
      if (isPlaying && audioRef.current.paused === false) {
        audioRef.current.pause();
      }
      
      try {
        // Try different URL formats if the original one doesn't work
        let formattedUrl = effectiveAudioUrl;
        
        // First try: Original URL
        if (!formattedUrl.startsWith('http')) {
          formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${formattedUrl}`;
        }
        
        // Handle spaces and parentheses
        if (formattedUrl.includes(' ') || formattedUrl.includes('(') || formattedUrl.includes(')')) {
          formattedUrl = encodeURI(formattedUrl);
        }
        
        console.log("Setting formatted URL:", formattedUrl);
        audioRef.current.src = formattedUrl;
        audioRef.current.load();
        
        // Add a fallback in case the first load fails
        audioRef.current.onerror = () => {
          console.log("Initial load failed, trying alternate encoding");
          
          // Try different encoding approach
          const filename = effectiveAudioUrl.split('/').pop();
          if (filename) {
            const altUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${encodeURIComponent(filename)}`;
            console.log("Trying alternate URL:", altUrl);
            audioRef.current!.src = altUrl;
            audioRef.current!.load();
          }
        };
      } catch (err) {
        console.error("Error setting audio source:", err);
      }
    }
  }, [effectiveAudioUrl]);
  
  // Handle play/pause state
  useEffect(() => {
    if (!audioRef.current || !effectiveAudioUrl) return;
    
    if (isPlaying) {
      console.log("Attempting to play:", effectiveAudioUrl);
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          // Reset play state
          onPlayToggle();
          toast.error("Could not play audio. Please try again.");
        });
      }
    } else {
      if (!audioRef.current.paused) {
        console.log("Pausing audio");
        audioRef.current.pause();
      }
    }
  }, [isPlaying, effectiveAudioUrl, onPlayToggle]);
  
  const handlePlayPauseClick = () => {
    if (audioError) {
      // If there was an error, try reloading before playing
      if (audioRef.current && effectiveAudioUrl) {
        // Try different URL formats if the original one doesn't work
        let formattedUrl = effectiveAudioUrl;
        
        // First try: Original URL
        if (!formattedUrl.startsWith('http')) {
          formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${formattedUrl}`;
        }
        
        // Handle spaces and parentheses
        if (formattedUrl.includes(' ') || formattedUrl.includes('(') || formattedUrl.includes(')')) {
          formattedUrl = encodeURI(formattedUrl);
        }
        
        audioRef.current.src = formattedUrl;
        audioRef.current.load();
      }
      
      setAudioError(null);
    }
    
    onPlayToggle();
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={handlePlayPauseClick}
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
