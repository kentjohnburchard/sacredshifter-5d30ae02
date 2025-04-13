
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
        
        // Set output to destination to ensure sound flows through
        newAnalyser.connect(context.destination);
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
      if (
        audioContext && 
        analyser && 
        audioRef.current && 
        !sourceConnected.current
      ) {
        console.log("Audio element available for connection:", audioRef.current);
        
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
            sourceNodeRef.current.connect(analyser);
            console.log("Successfully connected audio source to analyzer");
            sourceConnected.current = true;
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
          alreadyConnected: sourceConnected.current
        });
      }
    };
    
    // Try connecting immediately if we have everything we need
    if (audioRef.current && audioContext && analyser && !sourceConnected.current) {
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
