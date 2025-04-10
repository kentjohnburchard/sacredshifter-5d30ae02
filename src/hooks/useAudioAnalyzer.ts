
import { useEffect, useState } from 'react';

export function useAudioAnalyzer(audioRef: React.RefObject<HTMLAudioElement>) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!audioRef.current || isInitialized) return;

    const initializeAudio = () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const source = context.createMediaElementSource(audioRef.current!);
        const analyserNode = context.createAnalyser();

        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        analyserNode.connect(context.destination);

        setAudioContext(context);
        setAnalyser(analyserNode);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing audio analyzer:", error);
      }
    };

    // Initialize when audio starts playing
    const handlePlay = () => {
      if (!isInitialized) {
        initializeAudio();
      }
    };

    audioRef.current.addEventListener('play', handlePlay);
    
    return () => {
      audioRef.current?.removeEventListener('play', handlePlay);
      audioContext?.close();
    };
  }, [audioRef, audioContext, isInitialized]);

  return { audioContext, analyser };
}

export default useAudioAnalyzer;
