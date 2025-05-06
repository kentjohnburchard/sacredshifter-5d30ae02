
import React, { useEffect, useRef } from 'react';
import { SceneProps } from './SceneProps';

interface PrimeSymphonySceneProps extends SceneProps {
  activePrimes?: number[];
}

const PrimeSymphonyScene: React.FC<PrimeSymphonySceneProps> = ({ 
  analyzer, 
  isPlaying = false,
  activePrimes = [] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw prime number visualization
    ctx.fillStyle = '#9333ea';
    ctx.textAlign = 'center';
    ctx.font = '16px Arial';
    ctx.fillText('Prime Symphony Visualization', canvas.width / 2, 40);
    
    // Visualize active primes if any
    if (activePrimes.length > 0) {
      activePrimes.forEach((prime, index) => {
        const x = (canvas.width / (activePrimes.length + 1)) * (index + 1);
        const y = canvas.height / 2;
        const radius = 20 + (prime % 10) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${0.3 + (index / activePrimes.length) * 0.7})`;
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.fillText(prime.toString(), x, y + 5);
      });
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('No active primes - select some in the Prime Explorer', canvas.width / 2, canvas.height / 2);
    }
    
  }, [activePrimes, isPlaying]);
  
  return (
    <div className="prime-symphony-scene w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default PrimeSymphonyScene;
