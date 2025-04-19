
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { createTone } from '@/utils/audioUtils';
import { HarmonicInterval } from '@/data/harmonicSequence';

interface HarmonicIntervalTonePlayerProps {
  interval: HarmonicInterval;
  baseFrequency?: number;
}

const HarmonicIntervalTonePlayer: React.FC<HarmonicIntervalTonePlayerProps> = ({
  interval,
  baseFrequency = 256
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      stopTone();
    } else {
      playTone();
    }
  };

  const playTone = () => {
    const frequency = baseFrequency * interval.ratio;
    
    try {
      const { oscillator: osc, gainNode: gain } = createTone(frequency);
      
      // Apply styling based on the interval's color
      const buttonEl = document.getElementById(`tone-button-${interval.hertz}`);
      if (buttonEl) {
        buttonEl.style.boxShadow = `0 0 15px ${interval.color}`;
        buttonEl.style.backgroundColor = `${interval.color}33`; // Add 33 for 20% opacity
      }
      
      setOscillator(osc);
      setGainNode(gain);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error creating tone:', error);
    }
  };

  const stopTone = () => {
    if (oscillator && gainNode) {
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001, 
        oscillator.context.currentTime + 0.5
      );
      
      // Schedule stop after fade
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
      }, 500);

      // Reset button styling
      const buttonEl = document.getElementById(`tone-button-${interval.hertz}`);
      if (buttonEl) {
        buttonEl.style.boxShadow = 'none';
        buttonEl.style.backgroundColor = '';
      }
      
      setOscillator(null);
      setGainNode(null);
      setIsPlaying(false);
    }
  };

  return (
    <Button 
      id={`tone-button-${interval.hertz}`}
      variant={isPlaying ? "secondary" : "outline"} 
      size="sm"
      className={`transition-all ${isPlaying ? 'scale-105' : 'scale-100'} flex flex-col items-center p-2`}
      onClick={togglePlay}
    >
      <div className="flex items-center justify-center">
        {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </div>
      <div className="text-xs mt-1">{interval.name}</div>
      <div className="text-[0.65rem] opacity-70">{interval.ratio}x</div>
    </Button>
  );
};

export default HarmonicIntervalTonePlayer;
