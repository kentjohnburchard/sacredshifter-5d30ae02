
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CHAKRA_COLORS, ChakraTag } from '@/types/chakras';

interface CirclePulseMeterProps {
  dominantChakra?: ChakraTag;
  activity?: number; // 0-100
  currentResonance?: string;
  frequencies?: Array<number>;
}

const CirclePulseMeter: React.FC<CirclePulseMeterProps> = ({
  dominantChakra = 'Heart',
  activity = 50,
  currentResonance = 'Emotional Healing',
  frequencies = [528, 432, 639]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  const chakraColor = CHAKRA_COLORS[dominantChakra];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    let time = 0;
    const amplitude = Math.min(90, 30 + activity * 0.5);
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, `${chakraColor}10`);
      gradient.addColorStop(0.5, `${chakraColor}30`);
      gradient.addColorStop(1, `${chakraColor}10`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waveform
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let i = 0; i < canvas.width; i++) {
        let y = canvas.height / 2;
        
        // Create a composite wave from the frequencies
        frequencies.forEach((freq, index) => {
          // Normalize frequency for visualization
          const visualFreq = freq / 1000;
          // Create different waves for each frequency component
          y += Math.sin(time * 0.01 + i * visualFreq * 0.1) * (amplitude / (index + 2)) *
                Math.cos(i * 0.01 + time * 0.01);
        });
        
        ctx.lineTo(i, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.strokeStyle = chakraColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowColor = chakraColor;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = `${chakraColor}90`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Create a shimmering effect
      if (Math.random() > 0.8) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = (Math.random() * canvas.height / 2) + canvas.height / 4;
        ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fillStyle = chakraColor;
        ctx.fill();
      }
      
      time++;
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dominantChakra, activity, frequencies, chakraColor]);

  return (
    <div className="rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-base font-medium text-white">Circle Pulse</h3>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: chakraColor }}></span>
            <p className="text-sm text-white/70">
              Current Resonance: {currentResonance}
            </p>
          </div>
        </div>
        
        <motion.div 
          className="flex items-center justify-center w-10 h-10 rounded-full" 
          style={{ 
            background: `conic-gradient(${chakraColor}, ${chakraColor}80, ${chakraColor}20, ${chakraColor})` 
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chakraColor }}></div>
          </div>
        </motion.div>
      </div>
      
      <div className="relative h-20 mb-2">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full rounded"
        />
        
        {frequencies.length > 0 && (
          <div className="absolute bottom-1 right-1 bg-black/30 rounded px-1.5 py-0.5 text-xs text-white/70 backdrop-blur-sm">
            {frequencies[0]}Hz
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-xs text-white/60">
        <div>Activity: {activity}%</div>
        <div>{dominantChakra} Dominant</div>
      </div>
    </div>
  );
};

export default CirclePulseMeter;
