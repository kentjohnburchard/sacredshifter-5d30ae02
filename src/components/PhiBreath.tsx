
import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface PhiBreathProps {
  active: boolean;
  onToggle: () => void;
  audioContext: AudioContext | null;
}

const PhiBreath: React.FC<PhiBreathProps> = ({ active, onToggle, audioContext }) => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationControls = useAnimation();
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  
  // Setup/teardown oscillator for 5.5 Hz
  useEffect(() => {
    if (active && audioContext) {
      // Create oscillator at 5.5 Hz (binaural beat for theta waves)
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(5.5, audioContext.currentTime);
      
      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.1; // Low volume
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start oscillator
      oscillator.start();
      
      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      return () => {
        // Clean up
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      };
    }
  }, [active, audioContext]);
  
  // Animate the circle with golden ratio timing
  useEffect(() => {
    if (active) {
      const animateBreath = async () => {
        // Golden ratio breath cycle
        // Inhale for 1 unit, exhale for 1.618 units
        const phi = 1.618;
        const baseDuration = 5; // seconds
        
        const inhaleTime = baseDuration;
        const exhaleTime = baseDuration * phi;
        
        while (true) {
          // Inhale phase
          setBreathPhase('inhale');
          await animationControls.start({
            scale: 2.618, // Phi squared
            transition: { duration: inhaleTime, ease: "easeInOut" }
          });
          
          // Exhale phase
          setBreathPhase('exhale');
          await animationControls.start({
            scale: 1,
            transition: { duration: exhaleTime, ease: "easeInOut" }
          });
        }
      };
      
      animateBreath();
    } else {
      // Reset animation when inactive
      animationControls.stop();
      animationControls.set({ scale: 1 });
    }
  }, [active, animationControls]);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <button 
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded"
        onClick={onToggle}
      >
        Exit Phi Breath
      </button>
      
      <div className="flex flex-col items-center">
        <motion.div 
          className="relative w-64 h-64 mb-8"
          animate={animationControls}
        >
          {/* Phi Spiral */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full rotate-180"
          >
            <path 
              d="M50,0 A50,50 0 0 1 100,50 A50,50 0 0 1 50,100 A50,50 0 0 1 0,50 A50,50 0 0 1 50,0 Z" 
              fill="none" 
              stroke="rgba(255, 215, 0, 0.5)" 
              strokeWidth="1"
            />
            <path 
              d="M50,10 A40,40 0 0 1 90,50 A40,40 0 0 1 50,90 A40,40 0 0 1 10,50 A40,40 0 0 1 50,10 Z" 
              fill="none" 
              stroke="rgba(255, 215, 0, 0.5)" 
              strokeWidth="1"
            />
            <path 
              d="M50,20 A30,30 0 0 1 80,50 A30,30 0 0 1 50,80 A30,30 0 0 1 20,50 A30,30 0 0 1 50,20 Z" 
              fill="none" 
              stroke="rgba(255, 215, 0, 0.5)" 
              strokeWidth="1"
            />
            <path 
              d="M50,30 A20,20 0 0 1 70,50 A20,20 0 0 1 50,70 A20,20 0 0 1 30,50 A20,20 0 0 1 50,30 Z" 
              fill="none" 
              stroke="rgba(255, 215, 0, 0.6)" 
              strokeWidth="1"
            />
            <path 
              d="M50,40 A10,10 0 0 1 60,50 A10,10 0 0 1 50,60 A10,10 0 0 1 40,50 A10,10 0 0 1 50,40 Z" 
              fill="none" 
              stroke="rgba(255, 215, 0, 0.7)" 
              strokeWidth="1"
            />
          </svg>
          
          {/* Golden circle */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,223,0,0.3) 0%, rgba(255,215,0,0.1) 70%, rgba(255,215,0,0) 100%)",
              border: "2px solid rgba(255, 215, 0, 0.3)"
            }}
          />
        </motion.div>
        
        <div className="text-center text-white text-2xl font-light">
          {breathPhase === 'inhale' ? 'Inhale...' : 'Exhale...'}
        </div>
        <div className="text-center text-gold mt-2 text-lg opacity-80">
          {breathPhase === 'inhale' ? 'Expand. Receive. 1.' : 'Release. Let go. 1.618.'}
        </div>
        
        <div className="mt-8 text-center text-white text-sm opacity-70 max-w-md">
          <p>Breathing at the golden ratio (phi = 1.618) helps harmonize your body with the fundamental patterns of nature.</p>
          <p className="mt-2">The 5.5 Hz frequency supports theta brainwave states associated with deep meditation and healing.</p>
        </div>
      </div>
    </div>
  );
};

export default PhiBreath;
