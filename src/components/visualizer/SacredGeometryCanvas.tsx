
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SacredGeometryCanvasProps {
  colorScheme: 'purple' | 'blue' | 'rainbow' | 'gold';
}

const SacredGeometryCanvas: React.FC<SacredGeometryCanvasProps> = ({ 
  colorScheme = 'purple'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Find the global audio element
  useEffect(() => {
    const setupAudioContext = () => {
      try {
        const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
        
        if (!audioElement) {
          console.error('SacredGeometryCanvas: Global audio player not found');
          return false;
        }
        
        // Create audio context if it doesn't exist
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        
        // Create analyzer if it doesn't exist
        if (!analyserRef.current) {
          const analyser = audioCtxRef.current.createAnalyser();
          analyser.fftSize = 2048;
          analyserRef.current = analyser;
          
          // Create data array for frequency data
          const bufferLength = analyser.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
        }
        
        // Connect audio element to analyzer
        const source = audioCtxRef.current.createMediaElementSource(audioElement);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
        
        return true;
      } catch (error) {
        console.error('Error setting up audio context:', error);
        return false;
      }
    };
    
    // Try to set up audio context after a delay to ensure audio element is loaded
    setTimeout(() => {
      const success = setupAudioContext();
      if (success) {
        startVisualization();
      } else {
        // Retry after a longer delay if initial setup fails
        setTimeout(() => {
          setupAudioContext();
          startVisualization();
        }, 2000);
      }
    }, 500);
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);
  
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) {
      console.warn('SacredGeometryCanvas: Required refs not initialized yet');
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('SacredGeometryCanvas: Could not get 2d context');
      return;
    }
    
    // Set canvas to full viewport size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Call resize initially and add event listener
    resize();
    window.addEventListener('resize', resize);
    
    // Determine color scheme
    const getColor = (value: number): string => {
      value = Math.min(255, Math.max(0, value)); // Clamp value between 0-255
      
      switch (colorScheme) {
        case 'blue':
          return `hsla(210, 100%, ${30 + value / 4}%, ${0.4 + value / 600})`;
        case 'gold':
          return `hsla(45, 100%, ${30 + value / 4}%, ${0.4 + value / 600})`;
        case 'rainbow':
          return `hsla(${value}, 100%, 50%, ${0.5 + value / 500})`;
        case 'purple':
        default:
          return `hsla(270, 100%, ${30 + value / 4}%, ${0.4 + value / 600})`;
      }
    };
    
    let angle = 0;
    let particles: { x: number, y: number, size: number, color: string, speed: number }[] = [];
    
    const drawVisualization = () => {
      const analyser = analyserRef.current!;
      const dataArray = dataArrayRef.current!;
      
      // Clear canvas with semi-transparent black for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average frequency and bass levels for effects
      const frequencySum = dataArray.reduce((sum, value) => sum + value, 0);
      const averageFrequency = frequencySum / dataArray.length;
      
      // Calculate bass level (lower frequencies)
      let bassSum = 0;
      const bassRange = Math.min(30, dataArray.length / 8); // Lower frequencies
      for (let i = 0; i < bassRange; i++) {
        bassSum += dataArray[i];
      }
      const bassLevel = bassSum / bassRange;
      
      // Calculate mid level (mid frequencies)
      let midSum = 0;
      const midStart = Math.floor(dataArray.length / 8);
      const midEnd = Math.floor(dataArray.length / 3);
      for (let i = midStart; i < midEnd; i++) {
        midSum += dataArray[i];
      }
      const midLevel = midSum / (midEnd - midStart);
      
      // Calculate treble level (higher frequencies)
      let trebleSum = 0;
      const trebleStart = Math.floor(dataArray.length / 2);
      for (let i = trebleStart; i < dataArray.length; i++) {
        trebleSum += dataArray[i];
      }
      const trebleLevel = trebleSum / (dataArray.length - trebleStart);
      
      // Center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw centered circles that respond to bass
      const numCircles = 5;
      for (let i = 0; i < numCircles; i++) {
        const radius = (100 + i * 50) + bassLevel * (i + 1) / 5;
        const alpha = 0.3 - i * 0.05;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = getColor(bassLevel / 2);
        ctx.lineWidth = 2;
        ctx.setLineDash([5, bassLevel / 10]);
        ctx.stroke();
      }
      
      // Draw equalizer bars
      const barWidth = canvas.width / 128;
      const barSpacing = 2;
      const barCount = Math.floor(dataArray.length / 8); // Use only part of the spectrum
      const barHeightMultiplier = canvas.height / 512; // Scale the bars appropriately
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw circular equalizer
      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * 2];
        const barHeight = value * barHeightMultiplier;
        const angle = (i / barCount) * Math.PI * 2;
        
        const innerRadius = 120 + (bassLevel / 5);
        const outerRadius = innerRadius + barHeight;
        
        const x1 = Math.cos(angle) * innerRadius;
        const y1 = Math.sin(angle) * innerRadius;
        const x2 = Math.cos(angle) * outerRadius;
        const y2 = Math.sin(angle) * outerRadius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = barWidth - barSpacing;
        ctx.strokeStyle = getColor(value);
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Create sacred geometry patterns based on audio
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw geometric patterns
      const sides = 6 + Math.floor(bassLevel / 50); // More sides with more bass
      const radius = 100 + midLevel;
      
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = getColor(midLevel);
      ctx.lineWidth = 2 + trebleLevel / 50;
      ctx.stroke();
      
      // Add some particles for higher frequencies
      if (trebleLevel > 50 && Math.random() > 0.7) {
        const particleAngle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        
        particles.push({
          x: Math.cos(particleAngle) * distance,
          y: Math.sin(particleAngle) * distance,
          size: 2 + Math.random() * 4,
          color: getColor(trebleLevel),
          speed: 1 + Math.random() * 3
        });
      }
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.size -= 0.05;
        
        // Remove particles that are too small
        if (particle.size <= 0) {
          particles.splice(index, 1);
          return;
        }
        
        // Move particles outward
        const particleAngle = Math.atan2(particle.y, particle.x);
        particle.x += Math.cos(particleAngle) * particle.speed;
        particle.y += Math.sin(particleAngle) * particle.speed;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      // Limit number of particles
      if (particles.length > 100) {
        particles = particles.slice(-100);
      }
      
      ctx.restore();
      
      // Draw waveform at the bottom
      const sliceWidth = canvas.width / dataArray.length;
      const waveHeight = 50;
      const waveY = canvas.height - 100;
      
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      
      analyser.getByteTimeDomainData(dataArray);
      
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = waveY + (v - 1) * waveHeight;
        const x = i * sliceWidth;
        
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = getColor(200);
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Continue animation loop
      rafIdRef.current = requestAnimationFrame(drawVisualization);
    };
    
    drawVisualization();
    
    // Clean up function
    return () => {
      window.removeEventListener('resize', resize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 overflow-hidden z-0"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Add subtle sacred geometry overlay elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-purple-500/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-purple-400/20 rounded-full animate-spin-slow"></div>
      </div>
    </motion.div>
  );
};

export default SacredGeometryCanvas;
