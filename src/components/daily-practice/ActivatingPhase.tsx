
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface ActivatingPhaseProps {
  onComplete: () => void;
  skipAnimations?: boolean;
}

const ActivatingPhase: React.FC<ActivatingPhaseProps> = ({ onComplete, skipAnimations = false }) => {
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [mantraIndex, setMantraIndex] = useState(0);
  const { audioRef, setAudioSource } = useAudioPlayer();

  const mantras = [
    "I am the light I seek.",
    "My consciousness creates my reality.",
    "I am in perfect harmony with the universe.",
    "Divine wisdom flows through me.",
    "I am aligned with my highest purpose."
  ];

  // Skip animations if needed
  useEffect(() => {
    if (skipAnimations) {
      onComplete();
    }
  }, [skipAnimations, onComplete]);

  // Set up audio
  useEffect(() => {
    setAudioSource('/lovable-uploads/rising_tone_528_to_963.mp3');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [setAudioSource, audioRef]);

  // Timer for phase duration
  useEffect(() => {
    if (skipAnimations) return;
    
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, skipAnimations]);

  // Cycle through mantras
  useEffect(() => {
    if (skipAnimations) return;
    
    const mantraTimer = setInterval(() => {
      setMantraIndex(prev => (prev + 1) % mantras.length);
    }, 12000); // Change mantra every 12 seconds
    
    return () => clearInterval(mantraTimer);
  }, [skipAnimations, mantras.length]);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 min-h-[400px]">
      <h2 className="text-2xl font-bold text-white/90 mb-8">Activating Your Light</h2>
      
      {/* Sacred geometry animation */}
      <div className="relative w-64 h-64 mb-8">
        {/* Flower of Life pattern */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            rotate: { duration: 120, ease: "linear", repeat: Infinity },
            scale: { duration: 10, ease: "easeInOut", repeat: Infinity }
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-40">
            {/* Center circle */}
            <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="0.5" fill="none" />
            
            {/* First ring of circles */}
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const x = 50 + 20 * Math.cos(angle * Math.PI / 180);
              const y = 50 + 20 * Math.sin(angle * Math.PI / 180);
              return <circle key={angle} cx={x} cy={y} r="10" stroke="white" strokeWidth="0.5" fill="none" />;
            })}
            
            {/* Second ring of circles */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
              const x = 50 + 30 * Math.cos(angle * Math.PI / 180);
              const y = 50 + 30 * Math.sin(angle * Math.PI / 180);
              return <circle key={angle} cx={x} cy={y} r="10" stroke="white" strokeWidth="0.5" fill="none" />;
            })}
            
            {/* Outer circle */}
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </motion.div>
        
        {/* Golden spiral overlay */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            rotate: -360,
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            rotate: { duration: 180, ease: "linear", repeat: Infinity },
            opacity: { duration: 20, ease: "easeInOut", repeat: Infinity }
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path 
              d="M50,50 L50,10 A40,40 0 0,1 90,50 A40,40 0 0,1 50,90 A40,40 0 0,1 10,50 A40,40 0 0,1 50,10" 
              fill="none" 
              stroke="gold" 
              strokeWidth="0.5" 
              strokeOpacity="0.6"
            />
            <path 
              d="M50,50 L50,30 A20,20 0 0,1 70,50 A20,20 0 0,1 50,70 A20,20 0 0,1 30,50 A20,20 0 0,1 50,30" 
              fill="none" 
              stroke="gold" 
              strokeWidth="0.5"
              strokeOpacity="0.8" 
            />
          </svg>
        </motion.div>
        
        {/* Glowing center */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-500/30 shadow-[0_0_15px_5px_rgba(255,215,0,0.5)]" />
          </div>
        </motion.div>
      </div>
      
      {/* Mantra display */}
      <motion.div
        key={mantraIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 2 }}
        className="text-center"
      >
        <p className="text-2xl font-light text-white/90 mb-6 tracking-wide"
           style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}>
          {mantras[mantraIndex]}
        </p>
        
        <p className="text-lg text-white/70 italic">
          Carry this resonance into your journey.
        </p>
      </motion.div>
      
      {/* Timer */}
      <div className="absolute bottom-6 right-6 text-sm text-white/50">
        {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default ActivatingPhase;
