
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { isPrime } from '@/lib/primeUtils';
import { useAppStore } from '@/store';

interface PrimeNumberVisualizerProps {
  frequencyData?: Uint8Array;
  chakra?: string;
  isPlaying?: boolean;
}

const PrimeNumberVisualizer: React.FC<PrimeNumberVisualizerProps> = ({
  frequencyData,
  chakra = 'crown',
  isPlaying = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { primeSequence, setPrimeSequence } = useAppStore();
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  
  // Generate prime numbers for visualization
  useEffect(() => {
    // Generate a sequence of prime numbers
    const generatePrimes = () => {
      const primes: number[] = [];
      let num = 1;
      
      while (primes.length < 100) {
        num++;
        if (isPrime(num)) {
          primes.push(num);
        }
      }
      
      setPrimeSequence(primes);
    };
    
    if (primeSequence.length === 0) {
      generatePrimes();
    }
  }, [primeSequence.length, setPrimeSequence]);
  
  // Get chakra color
  const getChakraColor = () => {
    switch (chakra?.toLowerCase()) {
      case 'root': return '#ff0000';
      case 'sacral': return '#ff8000';
      case 'solar plexus': return '#ffff00';
      case 'heart': return '#00ff00';
      case 'throat': return '#00bfff';
      case 'third eye': return '#4b0082';
      case 'crown': 
      default: return '#8a2be2'; // Purple
    }
  };
  
  // Visualize using canvas
  useEffect(() => {
    if (!canvasRef.current || !frequencyData || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    setCanvasDimensions();
    
    const color = getChakraColor();
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Find dominant frequencies
    const newActivePrimes: number[] = [];
    if (frequencyData) {
      // Find the highest energy frequency bins
      const sortedFrequencies = Array.from(frequencyData)
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      
      sortedFrequencies.forEach(freq => {
        const frequencyValue = freq.index * 20 + 20; // Map to audible frequency range
        
        // Find nearest prime
        const nearestPrime = primeSequence.reduce((closest, prime) => {
          return Math.abs(prime - frequencyValue) < Math.abs(closest - frequencyValue) 
            ? prime 
            : closest;
        }, primeSequence[0] || 2);
        
        if (!newActivePrimes.includes(nearestPrime)) {
          newActivePrimes.push(nearestPrime);
        }
      });
      
      setActivePrimes(newActivePrimes);
    }
    
    // Draw prime number spiral (Ulam spiral)
    const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
    const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));
    const size = Math.min(centerX, centerY) * 0.05;
    
    // Setup for drawing the spiral
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Draw the primes in the sequence in a spiral pattern
    let x = 0;
    let y = 0;
    let stepSize = 1;
    let stepCount = 0;
    let direction = 0; // 0: right, 1: up, 2: left, 3: down
    
    primeSequence.forEach((prime, index) => {
      const isPrimeActive = activePrimes.includes(prime);
      
      // Calculate position in spiral
      const distance = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Draw node
      ctx.beginPath();
      const intensity = isPrimeActive ? 1 : 0.3;
      const radius = isPrimeActive ? size * 1.5 : size;
      
      // Use frequency data to modulate the appearance if active
      if (isPrimeActive && frequencyData) {
        const freqIndex = Math.floor((index % frequencyData.length) * 0.9);
        const freqValue = frequencyData[freqIndex] / 255;
        const pulseRadius = radius * (1 + freqValue * 0.5);
        
        // Draw pulsating outer ring
        ctx.beginPath();
        ctx.arc(x * size * 3, y * size * 3, pulseRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${color}33`; // Semi-transparent
        ctx.fill();
      }
      
      // Draw the prime node
      ctx.beginPath();
      ctx.arc(x * size * 3, y * size * 3, radius, 0, Math.PI * 2);
      ctx.fillStyle = `${color}${isPrimeActive ? 'ff' : '66'}`; // Full or semi-transparent color
      ctx.fill();
      
      // Add numeric label for key primes
      if (isPrimeActive || (prime < 20 && index % 3 === 0)) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `${radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prime.toString(), x * size * 3, y * size * 3);
      }
      
      // Move to next position in spiral
      stepCount++;
      if (stepCount === stepSize) {
        direction = (direction + 1) % 4;
        stepCount = 0;
        if (direction % 2 === 0) {
          stepSize++;
        }
      }
      
      switch (direction) {
        case 0: x++; break; // Right
        case 1: y--; break; // Up
        case 2: x--; break; // Left
        case 3: y++; break; // Down
      }
    });
    
    ctx.restore();
    
    // Draw connections between active primes
    if (activePrimes.length > 1) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      
      const positions: [number, number][] = activePrimes.map(prime => {
        const index = primeSequence.indexOf(prime);
        
        // Calculate spiral position for this index
        let x = 0, y = 0;
        let ss = 1;
        let sc = 0;
        let dir = 0;
        
        for (let i = 0; i < index; i++) {
          sc++;
          if (sc === ss) {
            dir = (dir + 1) % 4;
            sc = 0;
            if (dir % 2 === 0) ss++;
          }
          
          switch (dir) {
            case 0: x++; break;
            case 1: y--; break;
            case 2: x--; break;
            case 3: y++; break;
          }
        }
        
        return [x * size * 3, y * size * 3];
      });
      
      // Draw connection lines between positions
      ctx.beginPath();
      ctx.moveTo(positions[0][0], positions[0][1]);
      
      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i][0], positions[i][1]);
      }
      
      // Close the path if there are more than 2 points
      if (positions.length > 2) {
        ctx.lineTo(positions[0][0], positions[0][1]);
      }
      
      ctx.strokeStyle = `${color}aa`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    }
    
    // Draw legend
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 120, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Active Primes:', 15, 25);
    ctx.fillText(activePrimes.slice(0, 3).join(', '), 15, 45);
    
  }, [frequencyData, primeSequence, chakra, activePrimes, isPlaying]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
      />
    </motion.div>
  );
};

export default PrimeNumberVisualizer;
