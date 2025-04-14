
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface SacredGeometryCanvasProps {
  colorScheme: 'purple' | 'blue' | 'rainbow' | 'gold';
}

const SacredGeometryCanvas: React.FC<SacredGeometryCanvasProps> = ({ 
  colorScheme = 'purple'
}) => {
  const { liftTheVeil } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Use document.getElementById directly, and handle the audioElement not being found more gracefully
  useEffect(() => {
    const setupAudioContext = () => {
      try {
        // Get the global audio element
        const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
        
        if (!audioElement) {
          console.error('SacredGeometryCanvas: Global audio player not found, will retry');
          return false;
        }
        
        // Create audio context if it doesn't exist
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        // Create analyzer if it doesn't exist
        if (!analyserRef.current && audioCtxRef.current) {
          const analyser = audioCtxRef.current.createAnalyser();
          analyser.fftSize = 2048;
          analyserRef.current = analyser;
          
          // Create data array for frequency data
          const bufferLength = analyser.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
          
          // Connect audio element to analyzer only if not already connected
          try {
            const source = audioCtxRef.current.createMediaElementSource(audioElement);
            source.connect(analyserRef.current);
            analyserRef.current.connect(audioCtxRef.current.destination);
            console.log('SacredGeometryCanvas: Audio context setup complete');
          } catch (error) {
            // If we get an error about already being connected, we can proceed
            if (error instanceof DOMException && error.name === 'InvalidStateError') {
              console.log('SacredGeometryCanvas: Audio node already connected, reusing connection');
              return true;
            }
            console.error('SacredGeometryCanvas: Error connecting audio elements:', error);
            return false;
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error setting up audio context:', error);
        return false;
      }
    };
    
    // Try to set up audio context immediately
    const success = setupAudioContext();
    if (success) {
      startVisualization();
    } else {
      // Retry after a delay if initial setup fails
      const retryTimeout = setTimeout(() => {
        const retrySuccess = setupAudioContext();
        if (retrySuccess) {
          startVisualization();
        } else {
          console.warn('SacredGeometryCanvas: Failed to setup audio after retry, trying once more...');
          // Try one more time after another delay
          const finalRetry = setTimeout(() => {
            if (setupAudioContext()) {
              startVisualization();
            }
          }, 1000);
          return () => clearTimeout(finalRetry);
        }
      }, 500);
      
      return () => clearTimeout(retryTimeout);
    }
    
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
    
    // Set canvas to container size
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = 400;
        canvas.height = 300;
      }
    };
    
    // Call resize initially and add event listener
    resize();
    window.addEventListener('resize', resize);
    
    // Determine color scheme
    const getColor = (value: number): string => {
      value = Math.min(255, Math.max(0, value)); // Clamp value between 0-255
      
      switch (colorScheme) {
        case 'blue':
          return `hsla(210, 100%, ${30 + value / 4}%, ${0.7 + value / 400})`;
        case 'gold':
          return `hsla(45, 100%, ${30 + value / 4}%, ${0.7 + value / 400})`;
        case 'rainbow':
          return `hsla(${value}, 100%, 50%, ${0.8 + value / 400})`;
        case 'purple':
        default:
          return `hsla(280, 100%, ${30 + value / 4}%, ${0.7 + value / 400})`;
      }
    };
    
    let rotationAngle = 0; // Define a separate angle variable for rotation
    let particles: { x: number, y: number, size: number, color: string, speed: number }[] = [];
    
    const drawVisualization = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      
      // Clear canvas with semi-transparent black for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
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
        const radius = (60 + i * 30) + bassLevel * (i + 1) / 5; // Enhanced size multiplier
        const alpha = 0.4 - i * 0.05; // Enhanced alpha
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = getColor(bassLevel);
        ctx.lineWidth = 3; // Enhanced line width
        ctx.setLineDash([5, bassLevel / 8]);
        ctx.stroke();
      }
      
      // Draw equalizer bars
      const barWidth = Math.max(6, Math.min(10, canvas.width / 48)); // Wider bars
      const barSpacing = 2;
      const barCount = Math.floor(dataArray.length / 8); // Use more of the spectrum
      const barHeightMultiplier = canvas.height / 600; // Scale the bars appropriately
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw circular equalizer
      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * 2];
        const barHeight = value * barHeightMultiplier * 1.5; // Increased height multiplier
        const angle = (i / barCount) * Math.PI * 2;
        
        const innerRadius = 80 + (bassLevel / 5);
        const outerRadius = innerRadius + barHeight;
        
        const x1 = Math.cos(angle) * innerRadius;
        const y1 = Math.sin(angle) * innerRadius;
        const x2 = Math.cos(angle) * outerRadius;
        const y2 = Math.sin(angle) * outerRadius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = barWidth;
        ctx.strokeStyle = getColor(value);
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Create sacred geometry patterns based on audio
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Animate overall rotation for more movement
      rotationAngle += 0.005 + (averageFrequency / 10000);
      ctx.rotate(rotationAngle);
      
      // Draw geometric patterns - ENHANCED
      const sides = 6 + Math.floor(bassLevel / 40); // More sides with more bass
      const radius = 70 + midLevel; // Larger base radius
      
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
      ctx.lineWidth = 3 + trebleLevel / 40; // Thicker lines
      ctx.stroke();
      
      // Secondary geometric pattern - ENHANCED
      const innerRadius = radius * 0.6;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = ((i / sides) * Math.PI * 2) + (Math.PI / sides) + (rotationAngle * 0.5); // Added rotation
        const x = Math.cos(angle) * innerRadius;
        const y = Math.sin(angle) * innerRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = getColor(midLevel - 30);
      ctx.lineWidth = 2 + trebleLevel / 50;
      ctx.stroke();
      
      // Draw connecting lines - ENHANCED
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle1 = (i / sides) * Math.PI * 2;
        const x1 = Math.cos(angle1) * radius;
        const y1 = Math.sin(angle1) * radius;
        
        const angle2 = ((i / sides) * Math.PI * 2) + (Math.PI / sides);
        const x2 = Math.cos(angle2) * innerRadius;
        const y2 = Math.sin(angle2) * innerRadius;
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(0, 0); // Connect to center
        
        if (i % 2 === 0) { // Only some lines for cleaner look
          ctx.moveTo(x2, y2);
          ctx.lineTo(0, 0);
        }
      }
      ctx.strokeStyle = getColor(trebleLevel);
      ctx.lineWidth = 1 + trebleLevel / 100;
      ctx.stroke();
      
      // Add more particles for higher frequencies
      if (trebleLevel > 40 && Math.random() > 0.5) { // More particles
        const particleAngle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 100; // Wider particle distribution
        
        particles.push({
          x: Math.cos(particleAngle) * distance,
          y: Math.sin(particleAngle) * distance,
          size: 2 + Math.random() * 5, // Larger particles
          color: getColor(trebleLevel + Math.random() * 50),
          speed: 1 + Math.random() * 4 // Faster particles
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
        
        // Draw particle - ENHANCED
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.8; // Higher opacity
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
      
      // Limit number of particles
      if (particles.length > 150) { // Allow more particles
        particles = particles.slice(-150);
      }
      
      ctx.restore();
      
      // Draw waveform at the bottom - ENHANCED
      const sliceWidth = canvas.width / (dataArray.length / 2); // Use half of data for more detail
      const waveHeight = canvas.height / 6; // Taller
      const waveY = canvas.height - (canvas.height / 7);
      
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      
      analyser.getByteTimeDomainData(dataArray);
      
      for (let i = 0; i < dataArray.length / 2; i++) { // Use half of data points for more detail
        const v = dataArray[i] / 128.0;
        const y = waveY + (v - 1) * waveHeight;
        const x = i * sliceWidth;
        
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = getColor(210);
      ctx.lineWidth = 3; // Thicker line for visibility
      ctx.stroke();
      
      // Draw classic equalizer bars at the bottom - ENHANCED
      const eqBarWidth = Math.max(10, Math.min(16, canvas.width / 32)); // Wider bars
      const eqBarCount = Math.min(32, Math.floor(canvas.width / (eqBarWidth + 2)));
      const eqBarSpacing = 2;
      const eqBarMaxHeight = canvas.height / 3.5; // Taller bars
      const eqY = canvas.height - 10;
      
      for (let i = 0; i < eqBarCount; i++) {
        // Use a logarithmic distribution to focus more on lower frequencies
        const dataIndex = Math.floor(Math.pow(i / eqBarCount, 1.5) * (dataArray.length / 4));
        const value = dataArray[dataIndex];
        const eqBarHeight = (value / 255) * eqBarMaxHeight;
        
        const x = (i * (eqBarWidth + eqBarSpacing)) + (canvas.width - eqBarCount * (eqBarWidth + eqBarSpacing)) / 2;
        
        ctx.fillStyle = getColor(value);
        ctx.fillRect(x, eqY - eqBarHeight, eqBarWidth, eqBarHeight);
        
        // Add a slight glow effect
        ctx.shadowColor = getColor(value);
        ctx.shadowBlur = 8;
        ctx.fillRect(x, eqY - eqBarHeight, eqBarWidth, eqBarHeight);
        ctx.shadowBlur = 0;
      }
      
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
      className="w-full h-full overflow-hidden relative"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Add subtle sacred geometry overlay elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-purple-500/15 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-purple-400/30 rounded-full animate-spin-slow"></div>
      </div>
    </motion.div>
  );
};

export default SacredGeometryCanvas;
