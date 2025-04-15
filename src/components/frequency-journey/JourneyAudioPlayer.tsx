
import React, { useState, useEffect, useRef } from 'react';
import SacredAudioPlayerWithVisualizer from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { Button } from '@/components/ui/button';
import { Play, Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { JourneyTemplate } from '@/types/journey';
import { toast } from 'sonner';
import { analyzeFrequency } from '@/utils/primeCalculations';
import { useAppStore } from '@/store';

interface JourneyAudioPlayerProps {
  journey?: JourneyTemplate;
}

const JourneyAudioPlayer: React.FC<JourneyAudioPlayerProps> = ({ journey }) => {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { setDetectedPrimes, setIsPlaying, setAudioPlaybackError } = useAppStore();
  const audioInitialized = useRef(false);

  // Monitor audio for primes
  useEffect(() => {
    if (!isActive || !journey?.frequency) return;
    
    // Set up frequency monitoring interval to detect primes
    const monitorInterval = setInterval(() => {
      if (journey.frequency) {
        const analysis = analyzeFrequency(journey.frequency, 0.5);
        if (analysis.isPrime) {
          console.log(`Prime frequency detected: ${journey.frequency}Hz`);
          setDetectedPrimes([journey.frequency]);
        }
      }
    }, 1000);
    
    return () => clearInterval(monitorInterval);
  }, [isActive, journey, setDetectedPrimes]);

  // Initialize audio context when component mounts
  useEffect(() => {
    if (audioInitialized.current) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const context = new AudioContext();
        console.log("AudioContext created successfully");
        audioInitialized.current = true;
      }
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
      setAudioPlaybackError("Failed to initialize audio system");
    }
  }, [setAudioPlaybackError]);

  if (!journey) {
    return null;
  }

  const handleStartJourney = () => {
    setIsActive(true);
    // Force global playback state to true
    setIsPlaying(true);
    toast.info(`Starting journey: ${journey.title}`);
    
    // Initialize audio element if needed
    const audioElement = document.querySelector('audio#global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      // Ensure audio is ready to play
      audioElement.volume = 0.7;
      console.log("Audio element volume set to 0.7");
      
      // Add error handling for audio element
      const handleError = () => {
        console.error("Error playing audio");
        toast.error("There was an issue playing the audio. Please try again.");
        setAudioPlaybackError("Audio playback failed");
      };
      
      audioElement.addEventListener('error', handleError);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      toast.info("Entered fullscreen mode. Press ESC or click the minimize button to exit.");
    }
  };

  // Convert JourneyTemplate to the format expected by SacredAudioPlayerWithVisualizer
  const playerJourney = journey ? {
    id: journey.id,
    title: journey.title,
    description: journey.description,
    frequencies: journey.frequency ? [journey.frequency] : [],
    chakras: journey.chakra ? [journey.chakra] : [],
    affirmation: journey.description,
    theme: journey.chakra?.toLowerCase().includes('heart') ? 'pink' : 
           journey.chakra?.toLowerCase().includes('throat') ? 'blue' : 'purple',
    audioUrl: '/sounds/focus-ambient.mp3'
  } : undefined;

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center p-6 md:p-12 mx-4 md:mx-auto max-w-4xl bg-black/20 backdrop-blur-sm rounded-lg border border-purple-500/20">
        <h3 className="text-xl font-semibold text-purple-200 mb-4">{journey.title}</h3>
        <p className="text-gray-300 mb-6 text-center max-w-md">{journey.description}</p>
        <Button 
          onClick={handleStartJourney}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6"
        >
          <Play className="mr-2 h-4 w-4" /> Start Journey
        </Button>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'mx-4 md:mx-auto max-w-4xl'}`}>
      <div className="relative">
        <Button 
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full size-8 p-0 flex items-center justify-center"
          size="icon"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          className="absolute top-2 left-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full size-8 p-0 flex items-center justify-center"
          size="icon"
          onClick={() => toast.info("Volume controls are available in the player below")}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
        <SacredAudioPlayerWithVisualizer 
          journey={playerJourney} 
          isFullscreen={isFullscreen}
          forcePlay={true}
        />
      </div>
    </div>
  );
};

export default JourneyAudioPlayer;
