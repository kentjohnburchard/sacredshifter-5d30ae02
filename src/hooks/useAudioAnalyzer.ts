import { useState, useEffect, useRef } from 'react';

interface AudioAnalyzerResult {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
}

// Keep track of global instances to prevent reconnections
let globalAudioContext: AudioContext | null = null;
let globalAnalyser: AnalyserNode | null = null;
let connectedAudioElement: HTMLAudioElement | null = null;

function useAudioAnalyzer(audioElement: HTMLAudioElement | React.RefObject<HTMLAudioElement> | null): AudioAnalyzerResult {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(globalAudioContext);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(globalAnalyser);
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
    
    // Check if we're working with the same audio element as before
    if (audio && audio === connectedAudioElement && globalAudioContext && globalAnalyser) {
      console.log("useAudioAnalyzer: Reusing existing audio context and analyser");
      setAudioContext(globalAudioContext);
      setAnalyser(globalAnalyser);
      initialized.current = true;
      return;
    }
    
    // Only initialize if we have an audio element and haven't initialized yet
    if (audio && !initialized.current) {
      console.log("useAudioAnalyzer: Initializing with audio element", audio);
      
      try {
        // Create audio context if not already created
        if (!globalAudioContext) {
          globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        setAudioContext(globalAudioContext);
        
        // Create analyser node if not already created
        if (!globalAnalyser) {
          globalAnalyser = globalAudioContext.createAnalyser();
          globalAnalyser.fftSize = 2048;
          globalAnalyser.smoothingTimeConstant = 0.8;
        }
        
        setAnalyser(globalAnalyser);
        
        // Only create a new source node if we haven't connected this audio element before
        if (audio !== connectedAudioElement) {
          // Disconnect previous source if it exists
          if (sourceNodeRef.current) {
            sourceNodeRef.current.disconnect();
          }
          
          // Create new source node
          const sourceNode = globalAudioContext.createMediaElementSource(audio);
          sourceNodeRef.current = sourceNode;
          
          // Connect the nodes: sourceNode -> analyserNode -> destination
          sourceNode.connect(globalAnalyser);
          globalAnalyser.connect(globalAudioContext.destination);
          
          // Update connected audio element reference
          connectedAudioElement = audio;
        }
        
        // Mark as initialized
        initialized.current = true;
        
        console.log("useAudioAnalyzer: Audio analyzer setup complete");
      } catch (error) {
        console.error("useAudioAnalyzer: Error setting up audio analyzer", error);
      }
    }
  }, [audioElement]);

  return { audioContext, analyser };
}

export default useAudioAnalyzer;
