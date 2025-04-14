
import React, { useEffect, useRef, useState } from 'react';
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
  const prevColorSchemeRef = useRef<string>(colorScheme);
  const [primeNumbers, setPrimeNumbers] = useState<number[]>([]);
  
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
  
  // Effect to handle color scheme changes
  useEffect(() => {
    if (prevColorSchemeRef.current !== colorScheme) {
      prevColorSchemeRef.current = colorScheme;
      // Force redraw with new color scheme
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      startVisualization();
    }
  }, [colorScheme]);
  
  // Prime number detection function
  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    return true;
  };
  
  // Find prime numbers in frequency data
  const detectPrimeFrequencies = (dataArray: Uint8Array): number[] => {
    const primes: number[] = [];
    const threshold = 150; // Only detect strong frequencies
    
    for (let i = 20; i < dataArray.length; i++) {
      if (dataArray[i] > threshold) {
        // Convert frequency bin to approximate Hz
        const frequency = Math.round(i * audioCtxRef.current!.sampleRate / (dataArray.length * 2));
        if (isPrime(frequency) && !primes.includes(frequency)) {
          primes.push(frequency);
        }
      }
    }
    
    return primes;
  };
  
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
          return `hsla(210, 100%, ${30 + value / 4}%, ${0.9 + value / 400})`;
        case 'gold':
          return `hsla(45, 100%, ${30 + value / 4}%, ${0.9 + value / 400})`;
        case 'rainbow':
          return `hsla(${value}, 100%, 50%, ${0.9 + value / 400})`;
        case 'purple':
        default:
          return `hsla(280, 100%, ${30 + value / 4}%, ${0.9 + value / 400})`;
      }
    };
    
    let rotationAngle = 0; // Define a separate angle variable for rotation
    let particles: { x: number, y: number, size: number, color: string, speed: number, life: number, maxLife: number }[] = [];
    let primeParticles: { x: number, y: number, size: number, color: string, speed: number, life: number, maxLife: number, prime: number }[] = [];
    
    const drawVisualization = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      
      // Clear canvas with solid background for less transparency issues
      ctx.fillStyle = colorScheme === 'rainbow' 
        ? 'rgba(0, 0, 0, 0.9)' 
        : colorScheme === 'blue' 
          ? 'rgba(0, 5, 20, 0.9)' 
          : colorScheme === 'gold' 
            ? 'rgba(20, 10, 0, 0.9)' 
            : 'rgba(10, 0, 20, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Check for prime frequencies
      const newPrimes = detectPrimeFrequencies(dataArray);
      if (newPrimes.length > 0 && newPrimes.some(prime => !primeNumbers.includes(prime))) {
        // Update state with new primes
        setPrimeNumbers(prev => {
          const combined = [...prev, ...newPrimes.filter(p => !prev.includes(p))];
          return combined.slice(-10); // Keep only the 10 most recent primes
        });
        
        // Create special particles for prime frequencies
        newPrimes.forEach(prime => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 100;
          primeParticles.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            size: 5 + Math.random() * 10, // Larger particles for primes
            color: colorScheme === 'rainbow' ? `hsl(${Math.random() * 360}, 100%, 50%)` : getColor(255),
            speed: 2 + Math.random() * 4,
            life: 1.0,
            maxLife: 2 + Math.random() * 3,
            prime: prime
          });
        });
      }
      
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
        const radius = (60 + i * 30) + bassLevel * (i + 1) / 3; // Enhanced size multiplier
        const alpha = 0.7 - i * 0.05; // Enhanced alpha
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = getColor(bassLevel);
        ctx.lineWidth = 3 + (bassLevel / 70); // Line width responds to bass
        ctx.setLineDash([5, bassLevel / 8]);
        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      
      // Draw equalizer bars
      const barWidth = Math.max(6, Math.min(10, canvas.width / 48)); // Wider bars
      const barSpacing = 2;
      const barCount = Math.floor(dataArray.length / 8); // Use more of the spectrum
      const barHeightMultiplier = canvas.height / 600; // Scale the bars appropriately
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw circular equalizer that responds to music
      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * 2];
        const barHeight = value * barHeightMultiplier * 2.0; // Increased height multiplier
        const angle = (i / barCount) * Math.PI * 2;
        
        const innerRadius = 80 + (bassLevel / 4) + (Math.sin(Date.now() / 1000 + i / 10) * 5);
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
        ctx.globalAlpha = 0.8 + (value / 255) * 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      
      ctx.restore();
      
      // Create sacred geometry patterns based on audio
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Animate overall rotation for more movement - responds to audio levels
      rotationAngle += 0.005 + (averageFrequency / 5000);
      ctx.rotate(rotationAngle);
      
      // Draw geometric patterns - ENHANCED & RESPONSIVE
      const sides = 6 + Math.floor(bassLevel / 30); // More sides with more bass
      const radius = 70 + (midLevel / 2) + (Math.sin(Date.now() / 1000) * 10); // Pulsing radius
      
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
      ctx.lineWidth = 3 + trebleLevel / 30; // Thicker lines with higher frequencies
      ctx.globalAlpha = 0.8 + (midLevel / 255) * 0.2;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      
      // Secondary geometric pattern - ENHANCED & RESPONSIVE
      const innerRadius = radius * (0.5 + (bassLevel / 1000));
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const innerAngle = ((i / sides) * Math.PI * 2) + (Math.PI / sides) + (rotationAngle * 0.5); // Added rotation
        const x = Math.cos(innerAngle) * innerRadius;
        const y = Math.sin(innerAngle) * innerRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = getColor(midLevel - 30);
      ctx.lineWidth = 2 + trebleLevel / 40;
      ctx.globalAlpha = 0.7 + (midLevel / 255) * 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      
      // Draw connecting lines - ENHANCED & RESPONSIVE
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle1 = (i / sides) * Math.PI * 2;
        const x1 = Math.cos(angle1) * radius;
        const y1 = Math.sin(angle1) * radius;
        
        const angle2 = ((i / sides) * Math.PI * 2) + (Math.PI / sides);
        const x2 = Math.cos(angle2) * innerRadius;
        const y2 = Math.sin(angle2) * innerRadius;
        
        // Pulse the center based on bass
        const centerOffset = Math.sin(Date.now() / 500) * (bassLevel / 30);
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(centerOffset, centerOffset); // Connect to slightly offset center
        
        if (i % 2 === 0) { // Only some lines for cleaner look
          ctx.moveTo(x2, y2);
          ctx.lineTo(-centerOffset, -centerOffset);
        }
      }
      ctx.strokeStyle = getColor(trebleLevel);
      ctx.lineWidth = 1 + trebleLevel / 70;
      ctx.globalAlpha = 0.6 + (trebleLevel / 255) * 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      
      // Add more particles for higher frequencies - respond to treble
      if (trebleLevel > 30 && Math.random() > 0.5) { // More particles
        const particleAngle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 100; // Wider particle distribution
        
        particles.push({
          x: Math.cos(particleAngle) * distance,
          y: Math.sin(particleAngle) * distance,
          size: 2 + Math.random() * 5 + (trebleLevel / 100), // Size responds to treble
          color: getColor(trebleLevel + Math.random() * 50),
          speed: 1 + Math.random() * 4 + (trebleLevel / 100), // Speed responds to treble
          life: 1.0,
          maxLife: 1 + Math.random() * 2
        });
      }
      
      // Update and draw normal particles
      particles.forEach((particle, index) => {
        particle.size -= 0.05;
        particle.life -= 0.01 + Math.random() * 0.02;
        
        // Remove particles that are too small or dead
        if (particle.size <= 0 || particle.life <= 0) {
          particles.splice(index, 1);
          return;
        }
        
        // Move particles outward
        const particleAngle = Math.atan2(particle.y, particle.x);
        particle.x += Math.cos(particleAngle) * particle.speed * (0.5 + averageFrequency / 500);
        particle.y += Math.sin(particleAngle) * particle.speed * (0.5 + averageFrequency / 500);
        
        // Draw particle - ENHANCED
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life * 0.9; // Fade out based on life
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
      
      // Update and draw prime number particles
      primeParticles.forEach((particle, index) => {
        particle.life -= 0.005; // Slower fade for prime particles
        
        // Remove dead particles
        if (particle.life <= 0) {
          primeParticles.splice(index, 1);
          return;
        }
        
        // Special movement for prime particles - orbit around center
        const orbitSpeed = 0.01 + (particle.prime % 7) * 0.002;
        const currentAngle = Math.atan2(particle.y, particle.x);
        const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
        const newAngle = currentAngle + orbitSpeed;
        
        particle.x = Math.cos(newAngle) * distance;
        particle.y = Math.sin(newAngle) * distance;
        
        // Draw prime particle with special effects
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life * 0.9;
        ctx.fill();
        
        // Add glow effect for prime particles
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, particle.size * 0.5,
          particle.x, particle.y, particle.size * 1.5
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.life * 0.5;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Draw prime number text
        ctx.font = `${Math.min(16, particle.size * 2)}px Arial`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = particle.life * 0.9;
        ctx.fillText(`${particle.prime}`, particle.x, particle.y);
        ctx.globalAlpha = 1.0;
      });
      
      // Limit number of particles
      if (particles.length > 150) { // Allow more particles
        particles = particles.slice(-150);
      }
      if (primeParticles.length > 50) {
        primeParticles = primeParticles.slice(-50);
      }
      
      ctx.restore();
      
      // Draw waveform at the bottom - ENHANCED & RESPONSIVE
      const sliceWidth = canvas.width / (dataArray.length / 2); // Use half of data for more detail
      const waveHeight = canvas.height / 6 + (bassLevel / 10); // Taller, responds to bass
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
      ctx.lineWidth = 3 + (averageFrequency / 100); // Thickness responds to frequency
      ctx.stroke();
      
      // Draw classic equalizer bars at the bottom - ENHANCED & RESPONSIVE
      const eqBarWidth = Math.max(10, Math.min(16, canvas.width / 32)); // Wider bars
      const eqBarCount = Math.min(32, Math.floor(canvas.width / (eqBarWidth + 2)));
      const eqBarSpacing = 2;
      const eqBarMaxHeight = canvas.height / 3.5 + (averageFrequency / 10); // Taller bars, responds to sound
      const eqY = canvas.height - 10;
      
      for (let i = 0; i < eqBarCount; i++) {
        // Use a logarithmic distribution to focus more on lower frequencies
        const dataIndex = Math.floor(Math.pow(i / eqBarCount, 1.5) * (dataArray.length / 4));
        const value = dataArray[dataIndex];
        const eqBarHeight = (value / 255) * eqBarMaxHeight;
        
        const x = (i * (eqBarWidth + eqBarSpacing)) + (canvas.width - eqBarCount * (eqBarWidth + eqBarSpacing)) / 2;
        
        ctx.fillStyle = getColor(value);
        ctx.fillRect(x, eqY - eqBarHeight, eqBarWidth, eqBarHeight);
        
        // Add a stronger glow effect
        ctx.shadowColor = getColor(value);
        ctx.shadowBlur = 12;
        ctx.fillRect(x, eqY - eqBarHeight, eqBarWidth, eqBarHeight);
        ctx.shadowBlur = 0;
        
        // Add peak indicator
        if (value > 200) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, eqY - eqBarHeight - 3, eqBarWidth, 2);
        }
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
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] ${
          colorScheme === 'purple' ? 'bg-purple-500/15' :
          colorScheme === 'blue' ? 'bg-blue-500/15' :
          colorScheme === 'rainbow' ? 'bg-pink-500/15' :
          'bg-amber-500/15'
        } rounded-full animate-pulse-slow`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border ${
          colorScheme === 'purple' ? 'border-purple-400/30' :
          colorScheme === 'blue' ? 'border-blue-400/30' :
          colorScheme === 'rainbow' ? 'border-pink-400/30' :
          'border-amber-400/30'
        } rounded-full animate-spin-slow`}></div>
      </div>
    </motion.div>
  );
};

export default SacredGeometryCanvas;
