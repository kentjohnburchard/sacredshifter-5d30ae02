
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { createTone } from '@/utils/audioUtils';

interface HarmonicIntervalTonePlayerProps {
  baseFrequency: number;
  ratio: number;
  name?: string;
  className?: string;
}

const HarmonicIntervalTonePlayer: React.FC<HarmonicIntervalTonePlayerProps> = ({
  baseFrequency,
  ratio,
  name,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tone, setTone] = useState<any>(null);
  
  // Calculate the actual frequency based on base frequency and ratio
  const frequency = Math.round(baseFrequency * ratio * 100) / 100;
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (tone) {
        tone.stop();
      }
    };
  }, [tone]);
  
  const togglePlay = () => {
    if (isPlaying && tone) {
      tone.stop();
      setIsPlaying(false);
    } else {
      const newTone = createTone(frequency);
      setTone(newTone);
      newTone.play();
      setIsPlaying(true);
    }
  };
  
  return (
    <Button
      onClick={togglePlay}
      variant={isPlaying ? "secondary" : "outline"}
      size="sm"
      className={`text-xs flex items-center gap-1 ${className}`}
    >
      {isPlaying ? (
        <Square className="h-3 w-3" />
      ) : (
        <Play className="h-3 w-3" />
      )}
      {name || `${ratio}:1`} ({frequency}Hz)
    </Button>
  );
};

export default HarmonicIntervalTonePlayer;
