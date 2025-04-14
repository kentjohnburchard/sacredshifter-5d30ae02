
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Play, Pause } from "lucide-react";
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface FrequencyExperiencePlayerProps {
  audioUrl: string;
  title?: string;
  frequency?: number;
  imageUrl?: string;
}

const FrequencyExperiencePlayer: React.FC<FrequencyExperiencePlayerProps> = ({
  audioUrl,
  title = "Frequency Experience",
  frequency,
  imageUrl
}) => {
  const {
    isPlaying,
    togglePlay,
    duration,
    currentTime,
    setAudioSource,
    setCurrentTime
  } = useAudioPlayer();
  
  const [volume, setVolume] = useState(0.7);
  
  // Set the audio source when the component mounts
  useEffect(() => {
    if (audioUrl) {
      setAudioSource(audioUrl);
    }
  }, [audioUrl, setAudioSource]);
  
  // Update volume when it changes
  useEffect(() => {
    const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {frequency && (
              <p className="text-sm text-purple-600 dark:text-purple-400">{frequency}Hz</p>
            )}
          </div>
          
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={1}
              onValueChange={(value) => setCurrentTime(value[0])}
              className="flex-1"
            />
            <span className="text-xs">{formatTime(duration || 0)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-500" />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => setVolume(value[0])}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyExperiencePlayer;
