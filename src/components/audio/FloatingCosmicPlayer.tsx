
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
  
  const cosmicPlayerRef = useRef<any>(null);
  const { registerPlayerVisuals, isPlaying, currentAudio } = useGlobalAudioPlayer();
  const errorCountRef = useRef(0);
  const registeredRef = useRef(false);
  const registerAttemptsRef = useRef(0);
  const maxRegisterAttempts = 8;
  const registrationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear all timers when component unmounts
  useEffect(() => {
    return () => {
      if (registrationTimerRef.current) clearTimeout(registrationTimerRef.current);
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
    };
  }, []);
  
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

  // Visual heartbeat check - retry registration if visuals fail to load within 2 seconds
  const startVisualHeartbeatCheck = () => {
    // Clear any existing heartbeat timer
    if (heartbeatTimerRef.current) {
      clearTimeout(heartbeatTimerRef.current);
    }
    
    heartbeatTimerRef.current = setTimeout(() => {
      if (!registeredRef.current && audioUrl_) {
        console.log("FloatingCosmicPlayer: Visual heartbeat check - visuals not registered after 2 seconds");
        
        // Retry registration
        registerAttemptsRef.current = 0;
        attemptVisualRegistration();
        
        // Show toast if still failing after retry
        setTimeout(() => {
          if (!registeredRef.current) {
            toast.error("Visualizations failed to load. Try refreshing the page.");
            setVisualRegistrationState('failed');
            console.error("FloatingCosmicPlayer: Visual registration still failed after retry");
          }
        }, 2000);
      }
    }, 2000);
  };

  useEffect(() => {
    // Always attempt registration when component mounts
    attemptVisualRegistration();
    
    // Force a new heartbeat check when component mounts or remounts
    startVisualHeartbeatCheck();
    
    return () => {
      // Clear timers on unmount
      if (registrationTimerRef.current) clearTimeout(registrationTimerRef.current);
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
    };
    
  }, []);

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
      };
      
      // Register with the global player
      const success = registerPlayerVisuals({ setAudioSource: setAudioSourceCallback });
      
      if (success) {
        registeredRef.current = true;
        setVisualRegistrationState('registered');
        
        console.log("FloatingCosmicPlayer: Successfully registered with global audio player");
        console.log("FloatingCosmicPlayer: Visuals registered:", registeredRef.current);
        console.log("Visual sync info:", { audioUrl: audioUrl_, chakra, frequency });
        
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

  const handleError = (error: any) => {
    console.error("Cosmic player error:", error);
    errorCountRef.current += 1;
    
    if (errorCountRef.current <= 2) {
      toast.error("Audio visualization error. Attempting to recover...");
      
      setTimeout(() => {
        setPlayerKey(Date.now().toString());
      }, 500);
    } else {
      toast.error("Visualization failed. Try a different track or refresh the page.");
    }
  };
  
  const handleExpandStateChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpandStateChange) {
      onExpandStateChange(expanded);
    }
  };
  
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
      debugMode={visualRegistrationState === 'failed'} // Enable debug mode when registration fails
    />
  );
};

export default FloatingCosmicPlayer;
