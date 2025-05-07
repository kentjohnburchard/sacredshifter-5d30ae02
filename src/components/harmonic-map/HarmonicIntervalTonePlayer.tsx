
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { createTone } from '@/utils/audioUtils';

interface HarmonicIntervalTonePlayerProps {
  baseFrequency?: number;
  ratio?: number;
  frequency?: number;
  name?: string;
  className?: string;
  interval?: any; // Allow interval prop to be passed
}

const HarmonicIntervalTonePlayer: React.FC<HarmonicIntervalTonePlayerProps> = ({
  baseFrequency = 432,
  ratio = 1,
  frequency: directFrequency,
  name,
  className = '',
  interval
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tone, setTone] = useState<any>(null);
  
  // Calculate the actual frequency - support both direct frequency and ratio-based calculation
  // Also handle the interval prop if provided
  const frequency = directFrequency || 
                    (interval && interval.hertz) || 
                    Math.round(baseFrequency * ratio * 100) / 100;
  
  // Display name can come from multiple sources
  const displayName = name || 
                     (interval && interval.name ? `${interval.ratio}:1` : `${ratio}:1`);
  
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
      {displayName} ({frequency}Hz)
    </Button>
  );
};

export default HarmonicIntervalTonePlayer;
