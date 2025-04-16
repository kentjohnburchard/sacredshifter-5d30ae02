
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
    // Helper to safely get the HTMLAudioElement
    const getAudioElement = (): HTMLAudioElement | null => {
      if (!audioElement) return null;
      
      // If audioElement is a ref object with a current property
      if (audioElement && typeof audioElement === 'object' && 'current' in audioElement) {
        return audioElement.current;
      }
      
      // If audioElement is an actual HTMLAudioElement
      return audioElement as HTMLAudioElement;
    };

    const audio = getAudioElement();
    
    // Don't proceed if we don't have an audio element
    if (!audio) {
      console.log("useAudioAnalyzer: No audio element provided");
      return;
    }

    // Check if we're working with the same audio element as before
    if (audio === connectedAudioElement && globalAudioContext && globalAnalyser) {
      console.log("useAudioAnalyzer: Reusing existing audio context and analyser");
      setAudioContext(globalAudioContext);
      setAnalyser(globalAnalyser);
      initialized.current = true;
      return;
    }
    
    // Only initialize if we haven't initialized yet
    if (!initialized.current) {
      try {
        // Create audio context if not already created
        if (!globalAudioContext) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            globalAudioContext = new AudioContextClass();
            console.log("useAudioAnalyzer: Created new AudioContext");
          } else {
            console.error("useAudioAnalyzer: AudioContext not supported");
            return;
          }
        }
        
        setAudioContext(globalAudioContext);
        
        // Create analyser node if not already created
        if (!globalAnalyser && globalAudioContext) {
          globalAnalyser = globalAudioContext.createAnalyser();
          globalAnalyser.fftSize = 2048;
          globalAnalyser.smoothingTimeConstant = 0.8;
          console.log("useAudioAnalyzer: Created new AnalyserNode");
        }
        
        if (globalAnalyser) {
          setAnalyser(globalAnalyser);
          
          // Check if the audio element is already connected to the audio context
          if (audio !== connectedAudioElement && globalAudioContext) {
            // Disconnect previous source if it exists
            if (sourceNodeRef.current) {
              sourceNodeRef.current.disconnect();
              console.log("useAudioAnalyzer: Disconnected previous source node");
            }
            
            try {
              // Create new source node
              const sourceNode = globalAudioContext.createMediaElementSource(audio);
              sourceNodeRef.current = sourceNode;
              
              // Connect the nodes: sourceNode -> analyserNode -> destination
              sourceNode.connect(globalAnalyser);
              globalAnalyser.connect(globalAudioContext.destination);
              
              // Update connected audio element reference
              connectedAudioElement = audio;
              
              console.log("useAudioAnalyzer: Connected new audio element to audio context");
            } catch (e) {
              console.error("useAudioAnalyzer: Error connecting audio element", e);
            }
          }
        }
        
        // Mark as initialized
        initialized.current = true;
        console.log("useAudioAnalyzer: Audio analyzer setup complete");
      } catch (error) {
        console.error("useAudioAnalyzer: Error setting up audio analyzer", error);
      }
    }

    // Resume audio context if it's suspended (needed for some browsers)
    const resumeContext = () => {
      if (globalAudioContext && globalAudioContext.state === 'suspended') {
        globalAudioContext.resume().then(() => {
          console.log("useAudioAnalyzer: AudioContext resumed");
        });
      }
    };

    // Add event listener to resume context on user interaction
    document.addEventListener('click', resumeContext, { once: true });
    
    return () => {
      document.removeEventListener('click', resumeContext);
    };
  }, [audioElement]);

  return { audioContext, analyser };
}

export default useAudioAnalyzer;
