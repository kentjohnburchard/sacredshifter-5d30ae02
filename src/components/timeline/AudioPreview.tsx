
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AudioPreviewProps {
  audioUrl: string;
  title: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper function to format audio URL
  const formatAudioUrl = (url: string): string => {
    if (!url) return '';
    
    // If it's already a proper URL with http/https, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // For other URLs, assume they're relative to Supabase storage
    return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
  };

  const processedUrl = formatAudioUrl(audioUrl);

  useEffect(() => {
    // Create audio element when component mounts
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Reset state when URL changes
    setIsLoaded(false);
    setError(null);
    setIsPlaying(false);
    
    if (audioRef.current) {
      console.log("Setting up audio preview with URL:", processedUrl);
      
      // Set up event listeners for the audio element
      const handleCanPlay = () => {
        setIsLoaded(true);
        console.log("Audio loaded successfully:", processedUrl);
      };
      
      const handleError = (e: Event) => {
        console.error("Audio loading error:", e);
        setError("Could not load audio");
        setIsPlaying(false);
      };
      
      audioRef.current.addEventListener("canplaythrough", handleCanPlay);
      audioRef.current.addEventListener("error", handleError);
      
      // Load the audio source
      audioRef.current.src = processedUrl;
      audioRef.current.load();
      
      // Cleanup event listeners when component unmounts or URL changes
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
          audioRef.current.removeEventListener("error", handleError);
          audioRef.current.pause();
          audioRef.current.src = "";
        }
      };
    }
  }, [processedUrl]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Error playing audio:", err);
            setError("Unable to play audio");
            toast.error("Could not play audio. Please try again.");
          });
      }
    }
  };

  useEffect(() => {
    // Add ended event listener
    const handleAudioEnded = () => setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleAudioEnded);
        }
      };
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-2 my-2 text-red-500 text-sm">
        <span>Error loading audio: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 my-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!isLoaded}
        className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
          isPlaying ? "bg-purple-100" : "bg-gray-100"
        } ${!isLoaded ? "opacity-50" : ""}`}
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isPlaying ? `Pause ${title}` : `Play ${title}`}
        </span>
      </Button>
      
      <span className="text-sm font-medium text-gray-700">
        {isLoaded ? "Preview frequency audio" : "Loading audio..."}
      </span>
    </div>
  );
};

export default AudioPreview;
