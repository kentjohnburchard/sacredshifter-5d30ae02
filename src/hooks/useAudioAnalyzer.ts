
import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store';

/**
 * Hook to create and manage an AudioContext and AnalyserNode for audio visualization
 * @param audioElement Reference to the audio element to analyze
 * @returns Object containing the audioContext and analyser node
 */
const useAudioAnalyzer = (audioElement: HTMLAudioElement | null) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const { setAudioData, setFrequencyData } = useAppStore();
  
  useEffect(() => {
    // Only setup if we have an audio element
    if (!audioElement) return;
    
    let ctx: AudioContext | null = null;
    let analyzerNode: AnalyserNode | null = null;
    let sourceNode: MediaElementAudioSourceNode | null = null;
    
    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn("AudioContext is not supported by this browser");
        return;
      }
      
      ctx = new AudioContext();
      setAudioContext(ctx);
      
      // Create analyzer node
      analyzerNode = ctx.createAnalyser();
      analyzerNode.fftSize = 256; // Power of 2: 32, 64, 128, 256, 512, 1024, 2048
      analyzerNode.smoothingTimeConstant = 0.8; // Between 0 and 1
      setAnalyser(analyzerNode);
      
      // Connect the audio element to the analyzer
      try {
        sourceNode = ctx.createMediaElementSource(audioElement);
        sourceNodeRef.current = sourceNode;
        sourceNode.connect(analyzerNode);
        analyzerNode.connect(ctx.destination);
        
        console.log("Audio analyzer successfully connected");
      } catch (e: any) {
        // If it's already connected error, we can ignore it
        if (e.name === 'InvalidAccessError' || e.message?.includes('already connected')) {
          console.log("Audio element already connected to an audio context");
        } else {
          console.error("Error connecting audio element to analyzer:", e);
        }
      }
      
      // Setup interval to capture audio data
      const dataCapture = () => {
        if (analyzerNode) {
          const frequencyData = new Uint8Array(analyzerNode.frequencyBinCount);
          const timeData = new Uint8Array(analyzerNode.frequencyBinCount);
          
          analyzerNode.getByteFrequencyData(frequencyData);
          analyzerNode.getByteTimeDomainData(timeData);
          
          setFrequencyData(frequencyData);
          setAudioData(timeData);
        }
        requestAnimationFrame(dataCapture);
      };
      
      const animationId = requestAnimationFrame(dataCapture);
      
      return () => {
        cancelAnimationFrame(animationId);
        
        // Don't disconnect the source node to prevent issues with reusing the audio element
        if (ctx && ctx.state !== 'closed') {
          try {
            ctx.close();
          } catch (e) {
            console.error("Error closing audio context:", e);
          }
        }
      };
      
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
      return;
    }
  }, [audioElement, setAudioData, setFrequencyData]);
  
  return { audioContext, analyser };
};

export default useAudioAnalyzer;
