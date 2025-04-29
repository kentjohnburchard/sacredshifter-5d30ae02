
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPreviewProps {
  audioUrl: string;
  title?: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-md border border-gray-700/50 p-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-3">
        <Button 
          size="sm" 
          variant="outline"
          onClick={togglePlay}
          className="h-8 w-8 rounded-full p-0 border-purple-500/30 bg-purple-900/20 text-purple-200"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-grow">
          {title && <div className="text-xs text-purple-200 mb-1">{title}</div>}
          
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Slider 
              value={[currentTime]} 
              max={duration || 100}
              step={0.1}
              className="col-span-2"
              disabled
            />
            
            <div className="text-xs text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-3 w-3 text-gray-400" />
              <Slider 
                value={[volume]} 
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPreview;
