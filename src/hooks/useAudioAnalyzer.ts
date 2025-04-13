
import { useState, useEffect, useRef } from 'react';

interface AudioAnalyzerResult {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
}

function useAudioAnalyzer(audioElement: HTMLAudioElement | React.RefObject<HTMLAudioElement> | null): AudioAnalyzerResult {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Helper to get the actual HTMLAudioElement from various possible inputs
    const getAudioElement = (): HTMLAudioElement | null => {
      if (!audioElement) return null;
      
      // If audioElement is a ref object
      if ('current' in audioElement) {
        return audioElement.current;
      }
      
      // If audioElement is an actual HTMLAudioElement
      return audioElement;
    };

    const audio = getAudioElement();
    
    // Only initialize if we have an audio element and haven't initialized yet
    if (audio && !initialized.current) {
      console.log("useAudioAnalyzer: Initializing with audio element", audio);
      
      try {
        // Create audio context
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        
        // Create analyser node
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.smoothingTimeConstant = 0.8;
        setAnalyser(analyserNode);
        
        // Create source node from the audio element
        const sourceNode = ctx.createMediaElementSource(audio);
        sourceNodeRef.current = sourceNode;
        
        // Connect the nodes: sourceNode -> analyserNode -> destination
        sourceNode.connect(analyserNode);
        analyserNode.connect(ctx.destination);
        
        // Mark as initialized to prevent duplicate initialization
        initialized.current = true;
        
        console.log("useAudioAnalyzer: Audio analyzer setup complete");
      } catch (error) {
        console.error("useAudioAnalyzer: Error setting up audio analyzer", error);
      }
    }

    // Cleanup function
    return () => {
      if (audioContext && sourceNodeRef.current) {
        try {
          console.log("useAudioAnalyzer: Cleaning up audio analyzer");
          
          // Only disconnect if we have a source node
          if (sourceNodeRef.current) {
            sourceNodeRef.current.disconnect();
          }
          
          // Only set to null if cleanup is actually happening
          sourceNodeRef.current = null;
          
        } catch (error) {
          console.error("useAudioAnalyzer: Error cleaning up audio analyzer", error);
        }
      }
    };
  }, [audioElement]);

  return { audioContext, analyser };
}

export default useAudioAnalyzer;
