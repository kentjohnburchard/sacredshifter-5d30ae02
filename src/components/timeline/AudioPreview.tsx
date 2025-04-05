
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Create audio element when component mounts
    if (audioRef.current) {
      // Set up event listeners for the audio element
      audioRef.current.addEventListener("canplaythrough", () => {
        setIsLoaded(true);
        console.log("Audio loaded successfully:", audioUrl);
      });
      
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
        setError("Could not load audio");
        setIsPlaying(false);
      });
      
      // Load the audio source
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
    
    // Cleanup event listeners when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplaythrough", () => {});
        audioRef.current.removeEventListener("error", () => {});
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Play with error handling
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("Unable to play audio");
        toast.error("Could not play audio. Please try again.");
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 my-2 text-red-500 text-sm">
        <span>Error loading audio: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 my-2">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded} 
        preload="auto"
      />
      
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
