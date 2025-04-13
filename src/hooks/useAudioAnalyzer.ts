
import { useState, useEffect, useRef } from 'react';

const useAudioAnalyzer = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  // Initialize all state first, before any conditional logic
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  
  // Track if we've already connected this audio element
  const sourceConnected = useRef<boolean>(false);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectionAttemptedRef = useRef<boolean>(false);
  const connectionTimeoutRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // Check if the audio element exists globally
  useEffect(() => {
    // Only create audio context if it doesn't exist yet
    if (!audioContext) {
      try {
        console.log("Creating new AudioContext");
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
        
        const newAnalyser = context.createAnalyser();
        newAnalyser.fftSize = 2048;
        setAnalyser(newAnalyser);
        
        // IMPORTANT: Don't connect to destination here - this creates a parallel audio path
        // That will cause the original audio path to be disconnected
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }
    
    // Try to connect audio element to analyzer when both are available and not already connected
    const connectAudio = () => {
      // Clear any existing timeout to prevent multiple attempts
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      // Only attempt connection if we have all required pieces and haven't already connected
      // Also check if the audio element has changed since last connection
      if (
        audioContext && 
        analyser && 
        audioRef.current && 
        (!sourceConnected.current || audioElementRef.current !== audioRef.current)
      ) {
        console.log("Audio element available for connection:", audioRef.current);
        
        // Save reference to current audio element
        audioElementRef.current = audioRef.current;
        
        // IMPORTANT: Always resume the audio context first
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log("AudioContext resumed successfully");
          }).catch(err => {
            console.error("Failed to resume AudioContext:", err);
          });
        }
        
        try {
          // Create a source node ONLY if we haven't already
          if (!sourceNodeRef.current) {
            console.log("Creating new MediaElementAudioSourceNode");
            sourceNodeRef.current = audioContext.createMediaElementSource(audioRef.current);
            
            // CRITICAL CHANGE: Create a gain node to preserve the original audio path
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 1.0; // Keep original volume
            
            // Connect in this order: source -> gain -> destination (for audio playback)
            sourceNodeRef.current.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Also connect to analyzer as a side chain (doesn't interrupt the audio flow)
            sourceNodeRef.current.connect(analyser);
            
            console.log("Successfully connected audio source to analyzer and preserved audio path");
            sourceConnected.current = true;
          } else if (audioElementRef.current !== audioRef.current) {
            // If the audio element changed but we already have a source node,
            // we need to disconnect the old one and create a new one
            console.log("Audio element changed, recreating connection");
            sourceNodeRef.current = null;
            sourceConnected.current = false;
            // Try connecting again on the next tick
            setTimeout(connectAudio, 0);
          }
        } catch (error) {
          console.log("Audio connection error (might already be connected):", error);
          // Most likely the audio element is already connected to another audio context
          // Mark as connected to prevent further attempts
          sourceConnected.current = true;
        }
      } else {
        console.log("Cannot connect audio yet:", {
          hasContext: !!audioContext,
          hasAnalyser: !!analyser,
          hasAudioRef: !!audioRef.current,
          alreadyConnected: sourceConnected.current,
          sameAudioElement: audioElementRef.current === audioRef.current
        });
      }
    };
    
    // Try connecting immediately if we have everything we need
    if (audioRef.current && audioContext && analyser) {
      connectionTimeoutRef.current = window.setTimeout(connectAudio, 100);
    }
    
    return () => {
      // Clean up timeout on unmount
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [audioRef.current, audioContext, analyser]);
  
  // Ensure the audio context is resumed when needed - especially on user interaction
  useEffect(() => {
    if (audioContext && audioContext.state === 'suspended') {
      const resumeAudioContext = () => {
        console.log("Attempting to resume AudioContext after user interaction");
        audioContext.resume().then(() => {
          console.log('AudioContext resumed successfully');
        }).catch(err => {
          console.error('Failed to resume AudioContext:', err);
        });
      };
      
      // Try to resume on a user interaction event
      const handleUserInteraction = () => {
        resumeAudioContext();
        // Clean up these event listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
      
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      
      // Also try to resume immediately (might work if this runs after a user gesture)
      resumeAudioContext();
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [audioContext]);
  
  return { audioContext, analyser };
};

export default useAudioAnalyzer;
