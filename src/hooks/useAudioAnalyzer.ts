
import { useState, useEffect, useRef } from 'react';

interface AudioContextWindow extends Window {
  webkitAudioContext: typeof AudioContext;
}

const useAudioAnalyzer = (audioElement: HTMLAudioElement | null) => {
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isSetupComplete = useRef(false);

  useEffect(() => {
    if (!audioElement || isSetupComplete.current) return;
    
    try {
      // Create AudioContext
      const context = new ((window as unknown as AudioContextWindow).webkitAudioContext || window.AudioContext)();
      setAudioContext(context);
      
      // Create analyzer node
      const analyzerNode = context.createAnalyser();
      analyzerNode.fftSize = 256;
      analyzerNode.smoothingTimeConstant = 0.8;
      
      // Connect the audio element to the analyzer
      const source = context.createMediaElementSource(audioElement);
      source.connect(analyzerNode);
      analyzerNode.connect(context.destination);
      
      // Store references
      sourceNodeRef.current = source;
      setAnalyzer(analyzerNode);
      isSetupComplete.current = true;
      
      console.log("Audio analyzer setup complete");
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
    }
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioElement, audioContext]);

  return analyzer;
};

export default useAudioAnalyzer;
