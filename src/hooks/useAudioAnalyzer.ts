
import { useState, useEffect, useRef } from 'react';

const useAudioAnalyzer = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  
  // Track if we've already connected this audio element
  const sourceConnected = useRef<boolean>(false);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  useEffect(() => {
    // Only proceed if we have an audio element
    if (!audioRef.current) {
      return;
    }
    
    // Create audio context only once
    if (!audioContext) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
        
        const newAnalyser = context.createAnalyser();
        newAnalyser.fftSize = 2048;
        setAnalyser(newAnalyser);
        
        // Only attempt to connect if not already connected
        if (!sourceConnected.current) {
          try {
            const source = context.createMediaElementSource(audioRef.current);
            sourceNodeRef.current = source; // Store reference to source node
            source.connect(newAnalyser);
            newAnalyser.connect(context.destination);
            sourceConnected.current = true;
          } catch (error) {
            console.error("Error connecting audio source:", error);
            // If an error occurs, it's likely already connected, so we'll mark it as connected
            sourceConnected.current = true;
          }
        }
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }
    
    // Cleanup function - we are careful not to access properties on null objects
    return () => {
      // We don't close the audio context here as it might be used elsewhere
      // We just ensure we don't reference any null objects during cleanup
      
      // No need to explicitly disconnect source - it will be garbage collected
      // when no longer referenced
    };
  }, [audioRef.current]);
  
  return { audioContext, analyser };
};

export default useAudioAnalyzer;
