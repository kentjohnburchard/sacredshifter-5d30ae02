
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
  
  useEffect(() => {
    // Only create audio context if it doesn't exist yet
    if (!audioContext) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
        
        const newAnalyser = context.createAnalyser();
        newAnalyser.fftSize = 2048;
        setAnalyser(newAnalyser);
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
        !sourceConnected.current && 
        !connectionAttemptedRef.current
      ) {
        // Mark that we've attempted a connection to prevent multiple attempts
        connectionAttemptedRef.current = true;
        
        try {
          console.log("Attempting to connect audio to analyzer");
          // Create and connect a source node
          if (!sourceNodeRef.current && audioRef.current) {
            sourceNodeRef.current = audioContext.createMediaElementSource(audioRef.current);
            sourceNodeRef.current.connect(analyser);
            analyser.connect(audioContext.destination);
            sourceConnected.current = true;
            console.log("Successfully connected audio source to analyzer");
          }
        } catch (error) {
          console.log("Audio connection already exists or failed:", error);
          // If an error occurs, it's likely already connected, so we'll mark it as connected
          sourceConnected.current = true;
        }
      }
    };
    
    // Only try to connect if all required pieces are available
    if (audioRef.current && audioContext && analyser && !sourceConnected.current) {
      // Use a shorter delay for connection attempt
      connectionTimeoutRef.current = window.setTimeout(connectAudio, 100);
    }
    
    return () => {
      // Clean up timeout on unmount
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    };
  }, [audioRef.current, audioContext, analyser]);
  
  // Ensure the audio context is resumed when needed
  useEffect(() => {
    if (audioContext && audioContext.state === 'suspended') {
      const resumeAudioContext = () => {
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
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [audioContext]);
  
  return { audioContext, analyser };
};

export default useAudioAnalyzer;
