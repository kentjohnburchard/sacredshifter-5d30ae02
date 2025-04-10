
import { useEffect, useState, RefObject } from 'react';

export default function useAudioAnalyzer(audioRef: RefObject<HTMLAudioElement | null>) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    
    // Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContextClass();
    
    // Create an analyzer
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;
    
    // Set up media source from the audio element
    const source = context.createMediaElementSource(audioRef.current);
    source.connect(analyserNode);
    analyserNode.connect(context.destination);

    setAudioContext(context);
    setAnalyser(analyserNode);

    return () => {
      // Cleanup
      if (context.state !== 'closed') {
        context.close();
      }
    };
  }, [audioRef.current]);

  return { audioContext, analyser };
}
