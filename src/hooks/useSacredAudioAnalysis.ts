import { useState, useEffect, useRef } from 'react';
import { AudioAnalysisResult } from '@/types/visualization';
import { extractBPM } from '@/utils/visualizationMath';

interface UseSacredAudioAnalysisProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  providedAudioContext?: AudioContext;
  providedAnalyser?: AnalyserNode;
  sensitivity?: number;
}

const useSacredAudioAnalysis = ({
  audioRef,
  providedAudioContext,
  providedAnalyser,
  sensitivity = 1.0
}: UseSacredAudioAnalysisProps): AudioAnalysisResult => {
  const [analysis, setAnalysis] = useState<AudioAnalysisResult>({
    amplitude: 0,
    dominantFrequency: 0,
    frequencyBands: [0, 0, 0, 0, 0, 0, 0], // 7 bands for chakras
    bpm: null,
    isActive: false
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const timeDataRef = useRef<Float32Array | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const bpmUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio analysis
  useEffect(() => {
    // Use provided audio context and analyser if available
    if (providedAudioContext && providedAnalyser) {
      audioContextRef.current = providedAudioContext;
      analyserRef.current = providedAnalyser;
      
      // Set up data arrays
      const bufferLength = providedAnalyser.frequencyBinCount;
      frequencyDataRef.current = new Uint8Array(bufferLength);
      timeDataRef.current = new Float32Array(bufferLength);
      
      // Start the analysis loop
      startAnalysis();
      return;
    }
    
    // Otherwise set up our own audio context and analyzer if we have an audio element
    if (!audioRef?.current) return;

    const initAudio = () => {
      try {
        // Create audio context if it doesn't exist
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || 
            (window as any).webkitAudioContext)();
        }
        
        // Create analyzer if it doesn't exist
        if (!analyserRef.current && audioContextRef.current) {
          const analyser = audioContextRef.current.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.85;
          analyserRef.current = analyser;
          
          // Create data arrays for analysis
          frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
          timeDataRef.current = new Float32Array(analyser.fftSize);
        }
        
        // Connect audio element to analyzer if not already connected
        if (audioRef.current && audioContextRef.current && analyserRef.current && !sourceNodeRef.current) {
          try {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            source.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
            sourceNodeRef.current = source;
            console.log("Audio source connected to analyzer successfully");
          } catch (err) {
            console.error("Error connecting audio source:", err);
          }
        }
        
        // Start the analysis loop
        startAnalysis();
        
        // Set up BPM detection interval
        if (!bpmUpdateIntervalRef.current) {
          bpmUpdateIntervalRef.current = setInterval(detectBPM, 3000);
        }
        
      } catch (error) {
        console.error("Error initializing sacred audio analysis:", error);
      }
    };
    
    initAudio();
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (bpmUpdateIntervalRef.current) {
        clearInterval(bpmUpdateIntervalRef.current);
        bpmUpdateIntervalRef.current = null;
      }
    };
  }, [audioRef, providedAudioContext, providedAnalyser]);

  // Analyze audio and update state
  const analyzeAudio = () => {
    if (!analyserRef.current || !frequencyDataRef.current || !timeDataRef.current) {
      rafIdRef.current = requestAnimationFrame(analyzeAudio);
      return;
    }
    
    // Get frequency data
    analyserRef.current.getByteFrequencyData(frequencyDataRef.current);
    
    // Only calculate time domain data occasionally (for BPM)
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > 1000) {
      analyserRef.current.getFloatTimeDomainData(timeDataRef.current);
      lastUpdateTimeRef.current = now;
    }
    
    // Calculate amplitude (volume level)
    let sum = 0;
    for (let i = 0; i < frequencyDataRef.current.length; i++) {
      sum += frequencyDataRef.current[i];
    }
    const average = sum / frequencyDataRef.current.length;
    const normalizedAmplitude = (average / 256) * sensitivity; // Range 0-1
    
    // Find dominant frequency
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < frequencyDataRef.current.length; i++) {
      if (frequencyDataRef.current[i] > maxValue) {
        maxValue = frequencyDataRef.current[i];
        maxIndex = i;
      }
    }
    
    // Convert index to frequency
    // frequencyBinCount is half of fftSize due to Nyquist
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const dominantFrequency = maxIndex * sampleRate / analyserRef.current.fftSize;
    
    // Calculate frequency bands (for 7 chakras)
    const bandSize = frequencyDataRef.current.length / 7;
    const frequencyBands = Array(7).fill(0);
    
    for (let i = 0; i < 7; i++) {
      let bandSum = 0;
      const start = Math.floor(i * bandSize);
      const end = Math.floor((i + 1) * bandSize);
      
      for (let j = start; j < end; j++) {
        bandSum += frequencyDataRef.current[j];
      }
      
      frequencyBands[i] = bandSum / (end - start) / 256; // Normalize 0-1
    }
    
    // Update analysis state
    setAnalysis(prev => ({
      ...prev,
      amplitude: normalizedAmplitude,
      dominantFrequency,
      frequencyBands,
      isActive: normalizedAmplitude > 0.01 // Consider active if there's at least some sound
    }));
    
    // Continue the loop
    rafIdRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Start the analysis loop
  const startAnalysis = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(analyzeAudio);
  };

  // BPM detection (run less frequently)
  const detectBPM = () => {
    if (!timeDataRef.current || !audioContextRef.current || !analysis.isActive) return;
    
    const bpm = extractBPM(
      timeDataRef.current, 
      audioContextRef.current.sampleRate
    );
    
    if (bpm) {
      setAnalysis(prev => ({
        ...prev,
        bpm
      }));
    }
  };

  return analysis;
};

export default useSacredAudioAnalysis;
