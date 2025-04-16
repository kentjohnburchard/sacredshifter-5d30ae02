
import { useState, useEffect, useRef } from 'react';
import AudioContextService from '@/services/AudioContextService';
import { useAppStore } from '@/store';

/**
 * Hook to provide access to the global AudioContext and AnalyserNode for audio visualization
 */
export function useAudioAnalyzer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { setAudioData, setFrequencyData } = useAppStore();
  const frameRef = useRef<number | null>(null);
  const audioService = AudioContextService.getInstance();

  // Initialize the audio service
  useEffect(() => {
    const initialize = () => {
      const result = audioService.initialize();
      setIsInitialized(result);
      
      if (result) {
        // Set up audio data capture
        const captureAudioData = () => {
          if (audioService.isConnected) {
            const data = audioService.getAudioData();
            if (data) {
              setFrequencyData(data.frequencyData);
              setAudioData(data.waveformData);
            }
          }
          frameRef.current = requestAnimationFrame(captureAudioData);
        };
        
        frameRef.current = requestAnimationFrame(captureAudioData);
      }
    };

    // Initialize on first render
    initialize();
    
    // Also set up event listeners for user interaction
    const handleInteraction = () => {
      if (!isInitialized) {
        initialize();
      }
      audioService.resume().catch(console.error);
    };
    
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isInitialized, setAudioData, setFrequencyData]);

  // Function to connect audio element
  const connectAudioElement = (audioElement: HTMLAudioElement) => {
    if (!isInitialized) {
      audioService.initialize();
      setIsInitialized(true);
    }
    
    const result = audioService.connectAudioElement(audioElement);
    setIsConnected(result);
    return result;
  };

  // Function to resume audio context
  const resumeAudioContext = async () => {
    const result = await audioService.resume();
    return result;
  };

  return {
    audioContext: audioService.audioContext,
    analyser: audioService.analyser,
    isInitialized,
    isConnected,
    connectAudioElement,
    resumeAudioContext
  };
}

export default useAudioAnalyzer;
