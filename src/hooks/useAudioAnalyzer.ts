
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
  const connectionAttempted = useRef<boolean>(false);
  
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
    
    // Try to connect audio element to analyzer if we have both
    if (audioContext && analyser && audioRef.current && !sourceConnected.current && !connectionAttempted.current) {
      // Mark that we've attempted a connection to prevent multiple attempts
      connectionAttempted.current = true;
      
      try {
        // Try to create and connect a source node
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
    
    return () => {};
  }, [audioRef.current, audioContext, analyser]);
  
  return { audioContext, analyser };
};

export default useAudioAnalyzer;
