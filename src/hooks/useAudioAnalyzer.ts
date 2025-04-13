
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
    if (audioContext && !sourceConnected.current && audioRef.current) {
      try {
        const source = audioContext.createMediaElementSource(audioRef.current);
        sourceNodeRef.current = source;
        source.connect(analyser!);
        analyser!.connect(audioContext.destination);
        sourceConnected.current = true;
      } catch (error) {
        console.error("Error connecting audio source:", error);
        // If an error occurs, it's likely already connected, so we'll mark it as connected
        sourceConnected.current = true;
      }
    }
    
    // Cleanup function
    return () => {
      // No need to close AudioContext or disconnect sources
      // They might be used elsewhere
    };
  }, [audioRef.current, audioContext, analyser]);
  
  return { audioContext, analyser };
};

export default useAudioAnalyzer;
