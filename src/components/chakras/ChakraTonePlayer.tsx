
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { createTone } from '@/utils/createTone';

interface ChakraTonePlayerProps {
  baseFrequency: number;
  chakra: string;
  chakraColor: string;
}

const ChakraTonePlayer: React.FC<ChakraTonePlayerProps> = ({ 
  baseFrequency, 
  chakra, 
  chakraColor 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Use the optimized tone generator utility
  const [tone] = useState(() => createTone(baseFrequency, volume));

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (tone.isPlaying()) {
        tone.stop();
      }
    };
  }, [tone]);

  const handlePlay = () => {
    if (isPlaying) {
      tone.stop();
      setIsPlaying(false);
    } else {
      tone.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    tone.setVolume(newVolume);
  };

  return (
    <div className="flex flex-col items-center p-3 bg-white/20 backdrop-blur-md rounded-lg">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-sm font-medium">{chakra} ({baseFrequency}Hz)</span>
        <div className="flex items-center">
          <Slider 
            value={[volume]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={handleVolumeChange}
            className="w-24 mr-2" 
          />
          <Button 
            onClick={handlePlay} 
            size="sm"
            style={{ backgroundColor: chakraColor, color: "#fff" }}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </Button>
        </div>
      </div>
      <div 
        className="w-full h-1 rounded-full" 
        style={{ backgroundColor: chakraColor }}
      ></div>
    </div>
  );
};

export default ChakraTonePlayer;
