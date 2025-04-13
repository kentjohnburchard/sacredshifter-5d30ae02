
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface SacredPulseBarProps {
  className?: string;
}

const SacredPulseBar: React.FC<SacredPulseBarProps> = ({ className = '' }) => {
  const { liftTheVeil } = useTheme();
  const { isPlaying, audioElement } = useAudioPlayer();
  const [activeDigits, setActiveDigits] = useState<number[]>([]);
  const primeDigits = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];
  
  // Create audio analyzer when audio is playing
  useEffect(() => {
    if (!audioElement || !isPlaying) {
      setActiveDigits([]);
      return;
    }
    
    let audioContext: AudioContext | null = null;
    let analyzer: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let audioSource: MediaElementAudioSourceNode | null = null;
    let animationFrame: number | null = null;
    
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzer = audioContext.createAnalyser();
      audioSource = audioContext.createMediaElementSource(audioElement);
      audioSource.connect(analyzer);
      analyzer.connect(audioContext.destination);
      
      analyzer.fftSize = 64;
      const bufferLength = analyzer.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      const updatePulse = () => {
        if (!analyzer || !dataArray) return;
        
        analyzer.getByteFrequencyData(dataArray);
        
        // Calculate active digits based on frequency data
        const newActiveDigits: number[] = [];
        
        // Map frequencies to prime digits
        for (let i = 0; i < dataArray.length; i++) {
          const value = dataArray[i];
          const threshold = 130; // Sensitivity threshold
          
          if (value > threshold) {
            // Calculate which prime digit to activate based on the frequency bin
            const primeIndex = Math.floor(i / dataArray.length * primeDigits.length);
            if (primeIndex < primeDigits.length && !newActiveDigits.includes(primeDigits[primeIndex])) {
              newActiveDigits.push(primeDigits[primeIndex]);
            }
          }
        }
        
        setActiveDigits(newActiveDigits);
        animationFrame = requestAnimationFrame(updatePulse);
      };
      
      updatePulse();
      
    } catch (error) {
      console.error("Failed to initialize audio analyzer:", error);
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (audioSource) audioSource.disconnect();
      if (audioContext) audioContext.close();
    };
  }, [audioElement, isPlaying]);
  
  if (!isPlaying) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`sacred-pulse-bar ${className}`}
    >
      {primeDigits.map((digit) => (
        <motion.div 
          key={digit}
          className={`sacred-pulse-digit ${activeDigits.includes(digit) ? 'active' : ''}`}
          initial={{ scaleY: 1 }}
          animate={{ 
            scaleY: activeDigits.includes(digit) ? [1, 2.5, 1] : 1,
            opacity: activeDigits.includes(digit) ? 1 : 0.2
          }}
          transition={{ duration: 0.4 }}
        />
      ))}
    </motion.div>
  );
};

export default SacredPulseBar;
