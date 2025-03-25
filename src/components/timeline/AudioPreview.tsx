
import React, { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPreviewProps {
  audioUrl: string;
  title: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2 my-2">
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onEnded={handleAudioEnded} 
        className="hidden" 
      />
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
          isPlaying ? "bg-purple-100" : "bg-gray-100"
        }`}
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
        Preview frequency audio
      </span>
    </div>
  );
};

export default AudioPreview;
