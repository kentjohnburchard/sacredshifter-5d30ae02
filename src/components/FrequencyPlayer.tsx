
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import useAudioAnalyzer from "@/hooks/useAudioAnalyzer";
import { SacredGeometryVisualizer } from "@/components/sacred-geometry";
import { createTone } from "@/utils/audioUtils";

interface FrequencyPlayerProps {
  audioUrl?: string;
  url?: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  frequency?: number;
  frequencyId?: string;
  id?: string;
  groupId?: string;
  chakra?: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  url,
  isPlaying,
  onPlayToggle,
  frequency = 528,
  frequencyId,
  id,
  groupId,
  chakra
}) => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [usingFallbackTone, setUsingFallbackTone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const effectiveAudioUrl = url || audioUrl;
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);
  
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
        // Try to generate a fallback tone if frequency is available
        if (frequency) {
          playFallbackTone(frequency);
        } else {
          onPlayToggle();
          toast.error("Could not play audio. The file may be missing or in an unsupported format.");
        }
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
      
      // Also stop any fallback tone
      stopFallbackTone();
    };
  }, []);
  
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
      if (isPlaying) {
        audioRef.current.pause();
        stopFallbackTone();
      }
      
      try {
        // Try to load from local audio path first if it's a relative path
        let formattedUrl = effectiveAudioUrl;
        
        // If the URL doesn't begin with http/https, try local path
        if (!formattedUrl.startsWith('http')) {
          // Check if it's a local audio file path
          if (formattedUrl.includes('/audio/') || formattedUrl.includes('audio/')) {
            const path = formattedUrl.startsWith('/') ? formattedUrl : `/${formattedUrl}`;
            formattedUrl = `${window.location.origin}${path}`;
          } else {
            // For other URLs that might be Supabase paths
            console.log("Converting relative path to full URL");
            
            // Use a safer approach with a timeout for external resources
            formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${formattedUrl}`;
          }
        }
        
        // Handle spaces and parentheses
        if (formattedUrl.includes(' ') || formattedUrl.includes('(') || formattedUrl.includes(')')) {
          formattedUrl = encodeURI(formattedUrl);
        }
        
        console.log("Setting formatted URL:", formattedUrl);
        audioRef.current.src = formattedUrl;
        audioRef.current.load();
        
      } catch (err) {
        console.error("Error setting audio source:", err);
        setAudioError(`Error setting audio source: ${err}`);
      }
    } else {
      console.error("Audio element not initialized");
    }
  }, [effectiveAudioUrl, isPlaying]);
  
  useEffect(() => {
    if (usingFallbackTone) {
      // For fallback tone, just update state
      return;
    }
    
    if (!audioRef.current || !effectiveAudioUrl) return;
    
    if (isPlaying) {
      console.log("Attempting to play:", effectiveAudioUrl);
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          
          // Try to use fallback tone
          if (frequency) {
            playFallbackTone(frequency);
          } else {
            // Reset play state if no fallback is possible
            onPlayToggle();
            toast.error("Could not play audio. Please try again.");
          }
        });
      }
    } else {
      if (!audioRef.current.paused) {
        console.log("Pausing audio");
        audioRef.current.pause();
      }
      
      // Also stop any fallback tone
      stopFallbackTone();
    }
  }, [isPlaying, effectiveAudioUrl, onPlayToggle]);
  
  // Play a fallback tone using Web Audio API when the audio file fails to load
  const playFallbackTone = (frequency: number) => {
    try {
      stopFallbackTone(); // Stop any currently playing tone
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContextRef.current) {
        const buffer = createTone(audioContextRef.current, frequency, 30, 0.5);
        bufferSourceRef.current = audioContextRef.current.createBufferSource();
        bufferSourceRef.current.buffer = buffer;
        bufferSourceRef.current.connect(audioContextRef.current.destination);
        bufferSourceRef.current.start();
        setUsingFallbackTone(true);
        console.log(`Playing fallback tone at ${frequency}Hz`);
        toast.info(`Using generated ${frequency}Hz tone`);
      }
    } catch (error) {
      console.error("Error playing fallback tone:", error);
      toast.error("Unable to generate audio fallback");
      
      // Reset play state if fallback fails
      if (isPlaying) {
        onPlayToggle();
      }
    }
  };
  
  const stopFallbackTone = () => {
    if (bufferSourceRef.current) {
      try {
        bufferSourceRef.current.stop();
        bufferSourceRef.current.disconnect();
        bufferSourceRef.current = null;
        setUsingFallbackTone(false);
      } catch (error) {
        console.error("Error stopping fallback tone:", error);
      }
    }
  };
  
  const handlePlayPauseClick = () => {
    if (audioError && !usingFallbackTone) {
      // If there was an error, try using fallback tone
      if (frequency) {
        playFallbackTone(frequency);
        onPlayToggle();
        return;
      }
    }
    
    onPlayToggle();
  };
  
  const toggleVisualizer = () => {
    setShowVisualizer(prev => !prev);
  };
  
  return (
    <div className="relative">
      <SacredGeometryVisualizer 
        audioContext={audioContext} 
        analyser={analyser} 
        isVisible={showVisualizer && isPlaying}
        chakra={chakra}
        frequency={frequency}
        mode="fractal"
      />
      
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
        
        {isPlaying && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
            onClick={toggleVisualizer}
            aria-label={showVisualizer ? "Hide visualizer" : "Show visualizer"}
          >
            {showVisualizer ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FrequencyPlayer;
