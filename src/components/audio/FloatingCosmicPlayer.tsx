
import React, { useState, useEffect, useRef } from 'react';
import CosmicAudioPlayer from './CosmicAudioPlayer';
import { toast } from 'sonner';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface FloatingCosmicPlayerProps {
  audioUrl: string;
  title?: string;
  description?: string;
  initiallyVisible?: boolean;
  chakra?: string;
  frequency?: number;
  initialShape?: string;
  initialColorTheme?: string;
  initialIsExpanded?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
  visualModeOnly?: boolean;
}

const FloatingCosmicPlayer: React.FC<FloatingCosmicPlayerProps> = ({
  audioUrl,
  title = 'Sacred Audio',
  description,
  initiallyVisible = true,
  chakra,
  frequency,
  initialShape = 'flower-of-life',
  initialColorTheme = 'cosmic-purple',
  initialIsExpanded = false,
  onExpandStateChange,
  visualModeOnly = true
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [audioUrl_, setAudioUrl] = useState<string>('');
  const [playerKey, setPlayerKey] = useState<string>(Date.now().toString());
  const [visualRegistrationState, setVisualRegistrationState] = useState<'pending' | 'registered' | 'failed'>('pending');
  const [sourceConnected, setSourceConnected] = useState(false);
  
  const cosmicPlayerRef = useRef<HTMLDivElement>(null);
  const { registerPlayerVisuals, isPlaying, currentAudio, getAudioElement, forceVisualSync } = useGlobalAudioPlayer();
  const errorCountRef = useRef(0);
  const registeredRef = useRef(false);
  const registerAttemptsRef = useRef(0);
  const maxRegisterAttempts = 15;
  const registrationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  // Clear all timers when component unmounts
  useEffect(() => {
    return () => {
      if (registrationTimerRef.current) clearTimeout(registrationTimerRef.current);
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
    };
  }, []);
  
  // Handle new audio URL
  useEffect(() => {
    if (!audioUrl) {
      console.log("FloatingCosmicPlayer: Empty audio URL provided");
      return;
    }
    
    console.log("FloatingCosmicPlayer: Setting audio URL:", audioUrl);
    
    let formattedUrl = audioUrl;
    if (audioUrl && !audioUrl.startsWith('http')) {
      formattedUrl = audioUrl.startsWith('/') 
        ? `${window.location.origin}${audioUrl}`
        : `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
    }
    
    setAudioUrl(formattedUrl);
    setPlayerKey(Date.now().toString());
    errorCountRef.current = 0;
    
    setIsVisible(true);
    
    // Reset visual registration state when audio changes
    setVisualRegistrationState('pending');
    registeredRef.current = false;
    registerAttemptsRef.current = 0;
    
    // Start visual heartbeat check
    startVisualHeartbeatCheck();
    
  }, [audioUrl]);

  // Connect to global audio source
  const connectGlobalAudioSource = () => {
    try {
      // Get the global audio element - try both methods for robustness
      const globalAudio = getAudioElement ? getAudioElement() : document.querySelector('audio#global-audio-player');
      if (!globalAudio) {
        console.error("FloatingCosmicPlayer: Cannot connect source - global audio element not found");
        return false;
      }

      console.log("FloatingCosmicPlayer: Connecting to global audio source");
      
      // Clean up existing context and nodes if they exist
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        sourceNodeRef.current = null;
      }
      
      // Create or reuse audio context
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
          console.error("Failed to create audio context:", e);
          return false;
        }
      }
      
      // Create analyser if it doesn't exist
      if (!analyserRef.current && audioContextRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048; // Higher resolution
      }
      
      try {
        // Create media source from the global audio element if it doesn't exist
        if (!sourceNodeRef.current && audioContextRef.current) {
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(globalAudio as HTMLMediaElement);
          
          // Connect source -> analyser -> destination
          sourceNodeRef.current.connect(analyserRef.current!);
          analyserRef.current!.connect(audioContextRef.current.destination);
          
          console.log("FloatingCosmicPlayer: Successfully connected to global audio source");
          setSourceConnected(true);
          return true;
        } else if (sourceNodeRef.current) {
          console.log("FloatingCosmicPlayer: Audio source already connected");
          setSourceConnected(true);
          return true;
        }
      } catch (error: any) {
        // If the element is already connected to a node, we'll get an error
        if (error.name === 'InvalidAccessError' || error.message?.includes('already connected')) {
          console.log("FloatingCosmicPlayer: Audio element already connected to a node");
          setSourceConnected(true);
          return true;
        }
        
        console.error("FloatingCosmicPlayer: Error connecting to global audio source:", error);
        toast.error("Audio visualization error. Try refreshing the page.");
        return false;
      }
      
      return false;
    } catch (error) {
      console.error("FloatingCosmicPlayer: Error setting up audio context:", error);
      return false;
    }
  };

  // Visual heartbeat check - retry registration if visuals fail to load
  const startVisualHeartbeatCheck = () => {
    // Clear any existing heartbeat timer
    if (heartbeatTimerRef.current) {
      clearTimeout(heartbeatTimerRef.current);
    }
    
    heartbeatTimerRef.current = setTimeout(() => {
      if (!registeredRef.current && audioUrl_) {
        console.log("FloatingCosmicPlayer: Visual heartbeat check - visuals not registered after 2 seconds");
        
        // Force sync visuals if available
        if (forceVisualSync) {
          console.log("FloatingCosmicPlayer: Forcing visual sync from heartbeat");
          forceVisualSync();
        }
        
        // Retry registration
        registerAttemptsRef.current = 0;
        attemptVisualRegistration();
        
        // Try to connect audio source
        connectGlobalAudioSource();
        
        // Show toast if still failing after retry
        setTimeout(() => {
          if (!registeredRef.current || !sourceConnected) {
            toast.error("Visualizations failed to load. Try refreshing the page.");
            setVisualRegistrationState('failed');
            console.error("FloatingCosmicPlayer: Visual registration still failed after retry");
          }
        }, 2000);
      }
    }, 2000);
  };

  // Register with global player on mount
  useEffect(() => {
    // Always attempt registration when component mounts
    attemptVisualRegistration();
    
    // Force a new heartbeat check when component mounts or remounts
    startVisualHeartbeatCheck();
    
    // Try to connect to global audio source on mount
    const connected = connectGlobalAudioSource();
    console.log("FloatingCosmicPlayer: Initial source connection:", connected);
    
    return () => {
      // Clear timers on unmount
      if (registrationTimerRef.current) clearTimeout(registrationTimerRef.current);
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
    };
    
  }, []);

  // Attempt to register with global player
  const attemptVisualRegistration = () => {
    if (registerAttemptsRef.current >= maxRegisterAttempts) {
      console.warn("FloatingCosmicPlayer: Too many registration attempts, giving up");
      setVisualRegistrationState('failed');
      return;
    }
    
    registerAttemptsRef.current++;
    console.log(`FloatingCosmicPlayer: Registration attempt ${registerAttemptsRef.current} of ${maxRegisterAttempts}`);
    
    if (!registerPlayerVisuals) {
      console.error("registerPlayerVisuals function not available");
      
      if (registerAttemptsRef.current < maxRegisterAttempts) {
        registrationTimerRef.current = setTimeout(attemptVisualRegistration, 500);
      }
      return;
    }
    
    try {
      const setAudioSourceCallback = (url: string, info?: any) => {
        console.log("FloatingCosmicPlayer: Global player wants to sync audio:", url);
        
        if (!url) {
          console.log("FloatingCosmicPlayer: Received empty URL, hiding player");
          setIsVisible(false);
          return;
        }
        
        // Always update visuals even if it's the same URL to ensure sync
        let formattedUrl = url || '';
        if (url && !url.startsWith('http')) {
          formattedUrl = url.startsWith('/') 
            ? `${window.location.origin}${url}`
            : `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
        }
        
        console.log("FloatingCosmicPlayer: URL updated from global player:", formattedUrl);
        
        // Force re-render with new key to ensure visuals update
        setAudioUrl(formattedUrl);
        setPlayerKey(Date.now().toString());
        setIsVisible(true);
        
        // Try to connect audio source when we get new audio
        setTimeout(() => {
          connectGlobalAudioSource();
        }, 300);
      };
      
      // Register with the global player
      const unregisterFn = registerPlayerVisuals({ setAudioSource: setAudioSourceCallback });
      
      if (unregisterFn) {
        registeredRef.current = true;
        setVisualRegistrationState('registered');
        
        console.log("FloatingCosmicPlayer: Successfully registered with global audio player");
        
        // Explicitly try to connect to the audio source after successful registration
        setTimeout(() => {
          const connected = connectGlobalAudioSource();
          console.log("FloatingCosmicPlayer: Source connection attempt result:", connected);
        }, 500);
        
        // Cancel any pending registration attempts
        if (registrationTimerRef.current) {
          clearTimeout(registrationTimerRef.current);
        }
      } else {
        console.warn("FloatingCosmicPlayer: Registration returned false, will retry");
        if (registerAttemptsRef.current < maxRegisterAttempts) {
          registrationTimerRef.current = setTimeout(attemptVisualRegistration, 500);
        }
      }
    } catch (error) {
      console.error("Error registering player visuals:", error);
      
      if (registerAttemptsRef.current < maxRegisterAttempts) {
        registrationTimerRef.current = setTimeout(attemptVisualRegistration, 500);
      } else {
        setVisualRegistrationState('failed');
        toast.error("Audio visualization registration failed. Try refreshing the page.");
      }
    }
  };

  // Handle errors
  const handleError = (error: any) => {
    console.error("Cosmic player error:", error);
    errorCountRef.current += 1;
    
    if (errorCountRef.current <= 2) {
      toast.error("Audio visualization error. Attempting to recover...");
      
      // Try reconnecting the audio source
      connectGlobalAudioSource();
      
      setTimeout(() => {
        setPlayerKey(Date.now().toString());
      }, 500);
    } else {
      toast.error("Visualization failed. Try a different track or refresh the page.");
    }
  };
  
  // Handle expand state change
  const handleExpandStateChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpandStateChange) {
      onExpandStateChange(expanded);
    }
  };
  
  // Ensure source connection on playback
  useEffect(() => {
    // If playback starts, try to ensure source is connected
    if (isPlaying && !sourceConnected) {
      console.log("FloatingCosmicPlayer: Playback detected, ensuring source is connected");
      connectGlobalAudioSource();
    }
  }, [isPlaying]);
  
  if (!isVisible || !audioUrl_) {
    console.log("FloatingCosmicPlayer: Not visible or no audio URL, returning null");
    return null;
  }

  return (
    <CosmicAudioPlayer
      ref={cosmicPlayerRef}
      key={playerKey}
      defaultAudioUrl={audioUrl_}
      defaultFrequency={frequency || currentAudio?.frequency}
      title={title || currentAudio?.title || 'Sacred Audio'}
      description={description || (currentAudio?.chakra ? `Chakra: ${currentAudio.chakra}` : undefined)}
      chakra={chakra || currentAudio?.chakra}
      initialShape={initialShape}
      initialColorTheme={initialColorTheme}
      initialIsExpanded={initialIsExpanded}
      onExpandStateChange={handleExpandStateChange}
      autoPlay={false}
      syncWithGlobalPlayer={true}
      isPlaying={isPlaying}
      onError={handleError}
      allowShapeChange={true}
      allowColorChange={true}
      visualModeOnly={visualModeOnly}
      debugMode={visualRegistrationState === 'failed' || !sourceConnected}
      providedAudioContext={audioContextRef.current}
      providedAnalyser={analyserRef.current}
      sourceConnected={sourceConnected}
    />
  );
};

export default FloatingCosmicPlayer;
