
import React, { useState, useEffect, useRef } from 'react';
import SacredAudioPlayerWithVisualizer from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { Button } from '@/components/ui/button';
import { Play, Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { JourneyTemplate } from '@/types/journey';
import { toast } from 'sonner';
import { analyzeFrequency } from '@/utils/primeCalculations';
import { useAppStore } from '@/store';
import { testAudioUrl, getFallbackAudioUrl } from '@/utils/audioUrlHelper';

interface JourneyAudioPlayerProps {
  journey?: JourneyTemplate;
}

const JourneyAudioPlayer: React.FC<JourneyAudioPlayerProps> = ({ journey }) => {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { setDetectedPrimes, setIsPlaying, setAudioPlaybackError, setAudioInitialized } = useAppStore();
  const audioInitialized = useRef(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioUrlTested, setAudioUrlTested] = useState(false);
  const audioTestAttempts = useRef(0);
  const maxTestAttempts = 2;

  // Try to find a valid audio URL - but with safeguards to prevent endless loops
  useEffect(() => {
    if (audioUrlTested || audioTestAttempts.current >= maxTestAttempts) return;
    
    const attemptToFindAudioUrl = async () => {
      audioTestAttempts.current += 1;
      console.log("Testing audio URLs - attempt", audioTestAttempts.current);
      
      // Prioritize journey-specific audio if available
      // Note: journey.audioUrl is not directly on JourneyTemplate, so we handle it safely
      const journeySpecificUrls: string[] = [];
      
      // Default fallback urls
      const fallbackUrls = [
        '/assets/audio/meditation.mp3',
        '/assets/sounds/meditation.mp3',
        'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-2287.mp3',
        'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3',
      ];
      
      const testUrls = [...journeySpecificUrls, ...fallbackUrls];
      
      // Try each URL until we find one that works
      for (const url of testUrls) {
        try {
          console.log("Testing audio URL:", url);
          const isValid = await testAudioUrl(url, 3000); // 3 second timeout
          if (isValid) {
            console.log(`✅ Found working audio URL: ${url}`);
            setAudioUrl(url);
            setAudioUrlTested(true);
            return;
          }
        } catch (error) {
          console.log(`❌ Error testing audio URL: ${url}`);
        }
      }
      
      // If all tests fail, use fallback mechanism
      console.log("⚠️ No working audio URLs found, using fallback");
      const fallbackUrl = getFallbackAudioUrl();
      setAudioUrl(fallbackUrl);
      setAudioUrlTested(true);
    };
    
    attemptToFindAudioUrl();
  }, [journey, audioUrlTested]);

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
      const initAudio = () => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const context = new AudioContext();
          console.log("AudioContext created successfully");
          audioInitialized.current = true;
          setAudioInitialized(true);
        }
      };
      
      // Wait for user interaction to initialize audio
      const userInteractionHandler = () => {
        initAudio();
        document.removeEventListener('click', userInteractionHandler);
        document.removeEventListener('touchstart', userInteractionHandler);
      };
      
      document.addEventListener('click', userInteractionHandler);
      document.addEventListener('touchstart', userInteractionHandler);
      
      // Also try to initialize directly if possible
      initAudio();
      
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
      setAudioPlaybackError("Failed to initialize audio system");
    }
    
    return () => {
      document.removeEventListener('click', () => {});
      document.removeEventListener('touchstart', () => {});
    };
  }, [setAudioPlaybackError, setAudioInitialized]);

  if (!journey) {
    return null;
  }

  const handleStartJourney = () => {
    setIsActive(true);
    // Force global playback state to true
    setIsPlaying(true);
    toast.info(`Starting journey: ${journey.title}`);
    
    // Initialize audio element if needed
    const audioElement = document.querySelector('audio#global-audio-player') as HTMLAudioElement 
                       || document.createElement('audio');
    
    if (audioElement) {
      // Ensure audio is ready to play
      audioElement.volume = 0.7;
      audioElement.id = 'global-audio-player';
      audioElement.crossOrigin = 'anonymous';
      
      if (!audioElement.src && audioUrl) {
        audioElement.src = audioUrl;
      }
      
      if (!audioElement.parentElement) {
        document.body.appendChild(audioElement);
      }
      
      console.log("Audio element volume set to 0.7, source:", audioElement.src || audioUrl);
      
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
    audioUrl: audioUrl
  } : undefined;

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center p-6 md:p-12 mx-4 md:mx-auto max-w-4xl bg-black/20 backdrop-blur-sm rounded-lg border border-purple-500/20">
        <h3 className="text-xl font-semibold text-purple-200 mb-4">{journey.title}</h3>
        <p className="text-gray-300 mb-6 text-center max-w-md">{journey.description}</p>
        <Button 
          onClick={handleStartJourney}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          disabled={!audioUrlTested}
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
          audioUrl={audioUrl}
          isFullscreen={isFullscreen}
          forcePlay={true}
        />
      </div>
    </div>
  );
};

export default JourneyAudioPlayer;
