
import React, { useState, useEffect } from 'react';
import SacredGeometryCanvas from '@/components/visualizer/SacredGeometryCanvas';

interface FractalAudioVisualizerProps {
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  isVisible?: boolean;
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold';
  pauseWhenStopped?: boolean;
  frequency?: number;
  chakra?: string;
  onPrimeSequence?: (primes: number[]) => void;
  onFrequencyDetected?: (frequency: number) => void;
  expanded?: boolean;
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isVisible = true,
  colorScheme = 'purple',
  pauseWhenStopped = false,
  frequency,
  chakra,
  onPrimeSequence,
  onFrequencyDetected,
  expanded = false
}) => {
  const [primeSequence, setPrimeSequence] = useState<number[]>([]);

  // Reset sequence when component unmounts or visibility changes
  useEffect(() => {
    return () => {
      setPrimeSequence([]);
    };
  }, [isVisible]);

  // When a new prime is detected
  const handlePrimeDetected = (prime: number) => {
    setPrimeSequence(prevSequence => {
      // Only add unique primes
      if (!prevSequence.includes(prime)) {
        const newSequence = [...prevSequence, prime];
        
        // Notify parent component about the new sequence
        if (onPrimeSequence) {
          onPrimeSequence(newSequence);
        }
        
        return newSequence;
      }
      return prevSequence;
    });
  };
  
  // Handle frequency data
  const handleFrequencyData = (frequencies: number[]) => {
    // Find the dominant frequency
    let maxValue = 0;
    let maxIndex = 0;
    
    frequencies.forEach((value, index) => {
      if (value > maxValue) {
        maxValue = value;
        maxIndex = index;
      }
    });
    
    // Convert the bin index to frequency
    // This is a simplified approximation
    if (audioContext && maxValue > 0.1) {
      const nyquist = audioContext.sampleRate / 2;
      const estimatedFrequency = Math.round(maxIndex * nyquist / frequencies.length);
      
      if (onFrequencyDetected) {
        onFrequencyDetected(estimatedFrequency);
      }
    }
  };
  
  if (!isVisible) {
    return null;
  }

  if (pauseWhenStopped && (!audioContext || !analyser)) {
    return <div className="w-full h-full bg-black bg-opacity-20"></div>;
  }

  return (
    <div 
      className={`relative ${expanded ? 'fixed inset-0 z-50' : 'w-full h-full'}`} 
      style={{ overflow: 'hidden' }}
    >
      <SacredGeometryCanvas
        audioAnalyser={analyser}
        colorScheme={colorScheme}
        chakra={chakra} 
        frequency={frequency}
        onPrimeDetected={handlePrimeDetected}
        onFrequencyDataAvailable={handleFrequencyData}
        expanded={expanded}
      />
    </div>
  );
};

export default FractalAudioVisualizer;
