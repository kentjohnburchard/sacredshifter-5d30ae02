
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const SacredAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    currentTrack,
    audioRef
  } = useAudioPlayer();
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const { liftTheVeil } = useTheme();
  
  // Audio analysis setup
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [sourceNodeConnected, setSourceNodeConnected] = useState(false);
  
  // Sacred geometry animation state
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const circlesRef = useRef<Array<{x: number, y: number, radius: number, opacity: number, color: string}>>([]);
  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  
  // Chakra colors
  const chakraColors = {
    root: '#FF0000',
    sacral: '#FFA500',
    solar: '#FFFF00',
    heart: '#00FF00',
    throat: '#00FFFF',
    thirdEye: '#0000FF',
    crown: '#EE82EE'
  };

  // Initialize the AudioContext and setup the audio analyzer
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const newAudioContext = new AudioContext();
        setAudioContext(newAudioContext);
        
        // Create analyzer node
        const newAnalyser = newAudioContext.createAnalyser();
        newAnalyser.fftSize = 256;
        const bufferLength = newAnalyser.frequencyBinCount;
        const newDataArray = new Uint8Array(bufferLength);
        
        setAnalyser(newAnalyser);
        setDataArray(newDataArray);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioRef, audioContext]);

  // Connect the audio element to the analyzer when it's available
  useEffect(() => {
    if (!audioRef.current || !audioContext || !analyser || sourceNodeConnected) return;
    
    try {
      const sourceNode = audioContext.createMediaElementSource(audioRef.current);
      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      setSourceNodeConnected(true);
    } catch (error) {
      console.error("Error connecting audio source:", error);
    }
  }, [audioRef, audioContext, analyser, sourceNodeConnected]);

  // Setup canvas sizing and observe resize events
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        setCanvasSize({ width, height });
      }
    };
    
    // Initial size update
    updateCanvasSize();
    
    // Setup resize observer
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    const container = canvasRef.current.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }
    
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Draw the sacred geometry visualizer
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyser || !dataArray) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average amplitude
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const averageAmplitude = sum / dataArray.length;
    
    // Get center point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw seed of life (central circle)
    const seedRadius = Math.min(canvas.width, canvas.height) * 0.1 * (1 + (averageAmplitude / 255) * 0.2);
    
    // Choose color based on theme and current frequency
    let mainColor;
    if (liftTheVeil) {
      // Rainbow gradient or pink for lifted veil mode
      const gradientColor = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradientColor.addColorStop(0, 'rgba(255, 54, 171, 0.7)'); // Pink
      gradientColor.addColorStop(0.5, 'rgba(255, 112, 233, 0.7)'); // Lighter pink
      gradientColor.addColorStop(1, 'rgba(185, 103, 255, 0.7)'); // Purple
      mainColor = gradientColor;
    } else {
      // Use chakra color based on frequency if available
      let frequencyColor = '#8B5CF6'; // Default purple
      
      if (currentTrack?.customData?.frequency) {
        const freq = currentTrack.customData.frequency;
        if (freq < 250) frequencyColor = chakraColors.root;
        else if (freq < 350) frequencyColor = chakraColors.sacral;
        else if (freq < 450) frequencyColor = chakraColors.solar;
        else if (freq < 550) frequencyColor = chakraColors.heart;
        else if (freq < 650) frequencyColor = chakraColors.throat;
        else if (freq < 750) frequencyColor = chakraColors.thirdEye;
        else frequencyColor = chakraColors.crown;
      }
      
      mainColor = frequencyColor;
    }
    
    // Draw the seed circle with glow effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, seedRadius, 0, Math.PI * 2);
    ctx.fillStyle = typeof mainColor === 'string' ? `${mainColor}80` : mainColor; // Add transparency
    ctx.fill();
    
    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = typeof mainColor === 'string' ? mainColor : '#8B5CF6';
    
    // Draw flower of life patterns
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 * 0.8;
    const currentFrequency = currentTrack?.customData?.frequency || 0;
    
    // Check if current frequency is a prime number or close to one
    const isPrimeOrClose = primeNumbers.some(prime => 
      Math.abs(currentFrequency - prime) < 5 || 
      Math.abs(currentFrequency % prime) < 5
    );
    
    // Create new circles for prime frequencies
    if (isPrimeOrClose && isPlaying) {
      const numCircles = Math.floor(Math.random() * 3) + 4; // 4-6 circles
      
      for (let i = 0; i < numCircles; i++) {
        // Calculate position using polar coordinates
        const angle = (Math.PI * 2 / numCircles) * i;
        const distance = seedRadius * 2; // Distance from center
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Vary the colors slightly
        let circleColor;
        if (liftTheVeil) {
          const hue = (i * 30) % 360; // Distribute hues around the color wheel
          circleColor = `hsla(${hue}, 100%, 70%, 0.7)`;
        } else {
          circleColor = typeof mainColor === 'string' ? mainColor : '#8B5CF6';
        }
        
        circlesRef.current.push({
          x,
          y,
          radius: seedRadius * 0.7,
          opacity: 1,
          color: circleColor
        });
      }
    }
    
    // Draw and update all circles
    circlesRef.current = circlesRef.current.filter(circle => {
      // Update circle properties
      circle.radius += 0.5;
      circle.opacity -= 0.01;
      
      if (circle.opacity <= 0 || circle.radius > maxRadius) {
        return false; // Remove the circle
      }
      
      // Draw the circle
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color.replace(')', `, ${circle.opacity})`).replace('rgba', 'rgba').replace('hsla', 'hsla');
      ctx.fill();
      
      return true; // Keep the circle
    });
    
    // Reset glow for other elements
    ctx.shadowBlur = 0;
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  };

  // Start/stop the visualizer based on component mount/unmount
  useEffect(() => {
    if (isPlaying) {
      drawVisualizer();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, canvasSize]);

  // Add a special animation for prime number frequencies
  useEffect(() => {
    if (!currentTrack?.customData?.frequency) return;
    
    const frequency = currentTrack.customData.frequency;
    const isPrime = primeNumbers.includes(Math.round(frequency));
    
    if (isPrime && isPlaying) {
      // Add a burst of circles for prime frequencies
      const burst = () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Create circles in a burst pattern
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          const distance = Math.min(canvas.width, canvas.height) * 0.15;
          
          circlesRef.current.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            radius: Math.min(canvas.width, canvas.height) * 0.05,
            opacity: 0.9,
            color: liftTheVeil ? 
              `hsla(${(i * 45) % 360}, 100%, 70%, 0.7)` : 
              Object.values(chakraColors)[i % 7]
          });
        }
      };
      
      burst();
      const intervalId = setInterval(burst, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [currentTrack, isPlaying, liftTheVeil]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl sacred-audio-player ${isPlaying ? 'is-playing' : ''}`}>
      <div className="relative w-full h-full">
        {/* Canvas layer for visualization */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-lg sacred-geometry-canvas"
        />
        
        {/* Controls layer */}
        <div className="relative z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="px-4 py-2 bg-white text-black rounded flex items-center gap-1"
          >
            {isPlaying ? (
              <>
                <Pause size={14} /> <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} /> <span>Play</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
