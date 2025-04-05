
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FrequencyPlayerProps {
  audioUrl?: string;
  url?: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  frequency?: number;
  frequencyId?: string;
  id?: string; // Added id prop for identifying specific player instances
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  url,
  isPlaying,
  onPlayToggle,
  frequency,
  frequencyId,
  id // New id parameter
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
  
  // Try to fetch the audio file URL from the database if frequencyId is provided
  useEffect(() => {
    const fetchAudioFile = async () => {
      if (frequencyId) {
        try {
          const { data, error } = await supabase
            .from('frequency_library')
            .select('audio_url, url')
            .eq('id', frequencyId)
            .single();
          
          if (error) {
            console.error("Error fetching audio file:", error);
          } else if (data) {
            // Try to construct a valid audio URL
            const audioSource = data.audio_url || data.url;
            if (audioSource) {
              const fullPath = formatAudioUrl(audioSource);
              console.log(`Found audio file for frequency: ${fullPath}`);
              setAudioFileUrl(fullPath);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to fetch audio file data:", err);
        }
      }
      
      setIsLoading(false);
    };

    fetchAudioFile();
  }, [frequencyId]);
  
  // Improved URL formatting function for direct URLs
  const formatAudioUrl = (inputUrl?: string): string => {
    if (!inputUrl) return '';
    
    // Remove any potential query parameters that might cause issues
    const cleanedUrl = inputUrl.split('?')[0];
    
    // If it's already a full URL, return as is
    if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
      return cleanedUrl;
    }
    
    // Construct Supabase storage URL
    return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${cleanedUrl}`;
  };
  
  // Determine the best audio URL to use, prioritizing the one from the database
  const effectiveAudioUrl = audioFileUrl || formatAudioUrl(url || audioUrl);
  
  useEffect(() => {
    if (!effectiveAudioUrl) {
      console.error("No valid audio URL provided");
      setHasError(true);
      setIsLoading(false);
      return;
    }

    console.log("Attempting to play audio from URL:", effectiveAudioUrl);
    
    // Create a new audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      if (id) {
        audioRef.current.id = id; // Set the HTML id if provided
      }
    }
    
    const audio = audioRef.current;
    audio.src = effectiveAudioUrl;
    audio.preload = "auto"; // Preload audio data
    
    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio ready to play:", effectiveAudioUrl);
    };
    
    const handleError = (err: Event) => {
      console.error("Audio error:", err);
      setHasError(true);
      setIsLoading(false);
      toast.error(`Failed to load audio file`);
    };
    
    const handleEnded = () => {
      console.log("Audio playback ended");
      onPlayToggle();
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);
    
    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [effectiveAudioUrl, onPlayToggle, id]);
  
  useEffect(() => {
    if (!audioRef.current || hasError) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          setHasError(true);
          toast.error("Unable to play audio. Please check the file or try again later.");
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
