
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff,
  BarChart4,
  Activity,
  X,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

const VISUALIZER_MODES = [
  { value: 'flower', label: 'Flower of Life' },
  { value: 'merkaba', label: 'Merkaba' },
  { value: 'metatron', label: "Metatron's Cube" },
  { value: 'fractal', label: 'Fractal Flow' }
] as const;

type VisualizerMode = typeof VISUALIZER_MODES[number]['value'];

interface SacredAudioPlayerProps {
  initiallyExpanded?: boolean;
}

const SacredAudioPlayer = ({ initiallyExpanded = false }: SacredAudioPlayerProps) => {
  
  const { liftTheVeil } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [primes, setPrimes] = useState<number[]>([]);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(
    liftTheVeil ? 'fractal' : 'flower'
  );
  const [activeTooltipPrime, setActiveTooltipPrime] = useState<number | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const audioInitializedRef = useRef(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  
  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    artist?: string;
    imageUrl?: string;
    source: string;
    customData?: {
      frequency?: number;
      chakra?: string;
    };
  } | null>(null);
  
  const {
    isAudioPlaying,
    duration,
    currentAudioTime,
    togglePlayPause,
    seekTo,
    setAudioSource,
    audioRef,
    audioLoaded,
    audioError,
  } = useAudioPlayer();
  
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);

  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleAudioEnded = () => {
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };
    
    audioRef.current.removeEventListener('ended', handleAudioEnded);
    audioRef.current.addEventListener('ended', handleAudioEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioRef.current]);
  
  useEffect(() => {
    const handlePlayAudio = (event: CustomEvent) => {
      const { audioInfo } = event.detail;
      if (!audioInfo || !audioInfo.source) return;
      
      const isSameSource = currentAudio?.source === audioInfo.source;
      if (isSameSource && isAudioPlaying) {
        console.log("Already playing this audio, skipping replay");
        return;
      }
      
      setCurrentAudio(audioInfo);
      setAudioSource(audioInfo.source);
      setExpanded(true);
      
      const infoChangeEvent = new CustomEvent('audioInfoChange', {
        detail: { audioInfo }
      });
      window.dispatchEvent(infoChangeEvent);
      
      setTimeout(() => {
        if (!isAudioPlaying) {
          togglePlayPause();
        }
      }, 100);
    };

    const handleTogglePlayPause = () => {
      togglePlayPause();
    };

    const handleCallbackChange = (event: CustomEvent) => {
      const { callback } = event.detail;
      onEndedCallbackRef.current = callback;
    };

    window.addEventListener('playAudio' as any, handlePlayAudio as EventListener);
    window.addEventListener('togglePlayPause' as any, handleTogglePlayPause as EventListener);
    window.addEventListener('audioCallbackChange' as any, handleCallbackChange as EventListener);

    return () => {
      window.removeEventListener('playAudio' as any, handlePlayAudio as EventListener);
      window.removeEventListener('togglePlayPause' as any, handleTogglePlayPause as EventListener);
      window.removeEventListener('audioCallbackChange' as any, handleCallbackChange as EventListener);
    };
  }, [setAudioSource, togglePlayPause, isAudioPlaying, currentAudio]);

  useEffect(() => {
    const storeAudioInfo = () => {
      if (currentAudio) {
        sessionStorage.setItem('currentAudio', JSON.stringify(currentAudio));
        sessionStorage.setItem('isAudioPlaying', isAudioPlaying.toString());
      }
    };

    storeAudioInfo();
  }, [currentAudio, isAudioPlaying]);

  useEffect(() => {
    if (!audioInitializedRef.current) {
      const storedAudio = sessionStorage.getItem('currentAudio');
      const storedIsPlaying = sessionStorage.getItem('isAudioPlaying');
      
      if (storedAudio) {
        try {
          const audioInfo = JSON.parse(storedAudio);
          if (!currentAudio && audioInfo) {
            setCurrentAudio(audioInfo);
            setAudioSource(audioInfo.source);
            setExpanded(true);
            
            if (storedIsPlaying === 'true' && !isAudioPlaying) {
              setTimeout(() => togglePlayPause(), 100);
            }
          }
        } catch (error) {
          console.error('Error restoring audio state:', error);
        }
      }
      
      audioInitializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const event = new CustomEvent('audioStateChange', {
      detail: { isPlaying: isAudioPlaying }
    });
    window.dispatchEvent(event);
  }, [isAudioPlaying]);
  
  useEffect(() => {
    setVisualizerMode(liftTheVeil ? 'fractal' : 'flower');
  }, [liftTheVeil]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);
  
  // Sacred geometry visualization
  useEffect(() => {
    if (!analyser || !canvasRef.current || !showVisualizer || !isAudioPlaying) {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Create frequency data array
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Cache of prime numbers for quick lookup
    const primeCache: Record<number, boolean> = {};
    
    // Function to check if a number is prime
    const isPrime = (num: number): boolean => {
      if (primeCache[num] !== undefined) return primeCache[num];
      
      if (num <= 1) {
        primeCache[num] = false;
        return false;
      }
      if (num <= 3) {
        primeCache[num] = true;
        return true;
      }
      if (num % 2 === 0 || num % 3 === 0) {
        primeCache[num] = false;
        return false;
      }
      
      let i = 5;
      while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) {
          primeCache[num] = false;
          return false;
        }
        i += 6;
      }
      
      primeCache[num] = true;
      return true;
    };
    
    // Animation loop
    const animate = (timestamp: number) => {
      // Calculate time delta for smooth animations regardless of frame rate
      const elapsed = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      const deltaTime = Math.min(elapsed / 16.67, 2); // 16.67ms is roughly 60fps
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Detect dominant frequency
      let maxValue = 0;
      let maxIndex = 0;
      let bassEnergy = 0;
      let midEnergy = 0;
      let highEnergy = 0;
      
      // Calculate energy in different frequency bands
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] / 255; // Normalize to 0-1
        
        if (value > maxValue) {
          maxValue = value;
          maxIndex = i;
        }
        
        if (i < dataArray.length / 3) {
          bassEnergy += value;
        } else if (i < dataArray.length * 2/3) {
          midEnergy += value;
        } else {
          highEnergy += value;
        }
      }
      
      bassEnergy /= (dataArray.length / 3);
      midEnergy /= (dataArray.length / 3);
      highEnergy /= (dataArray.length / 3);
      
      // Calculate approximate frequency value from FFT bin index
      if (audioContext && maxValue > 0.2) {
        const sampleRate = audioContext.sampleRate;
        const binCount = analyser.frequencyBinCount;
        const dominantFreq = Math.round(maxIndex * sampleRate / (2 * binCount));
        
        setDetectedFrequency(dominantFreq);
        
        // If we detect a prime frequency that's audible, show notification and add to list
        if (isPrime(dominantFreq) && dominantFreq > 20 && dominantFreq < 2000 && maxValue > 0.5) {
          const currentTime = Date.now();
          const shouldAddPrime = primes.length === 0 || 
            primes[primes.length - 1] !== dominantFreq ||
            (currentTime - (tooltipTimerRef.current ? currentTime : 0) > 3000);
            
          if (shouldAddPrime) {
            setPrimes(prev => [...prev.slice(-10), dominantFreq]);
            setActiveTooltipPrime(dominantFreq);
            
            if (tooltipTimerRef.current) {
              clearTimeout(tooltipTimerRef.current);
            }
            
            tooltipTimerRef.current = setTimeout(() => {
              setActiveTooltipPrime(null);
              tooltipTimerRef.current = null;
            }, 3000);
          }
        }
      }
      
      // Draw the appropriate sacred geometry visualization based on mode
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.45;
      
      // Draw background gradient
      const backgroundColor = liftTheVeil ? 
        `rgba(25, 10, 40, ${0.7 + bassEnergy * 0.3})` : 
        `rgba(20, 10, 30, ${0.7 + bassEnergy * 0.3})`;
        
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Get colors based on chakra or mode
      const getBaseColor = () => {
        if (currentAudio?.customData?.chakra) {
          switch (currentAudio.customData.chakra.toLowerCase()) {
            case 'root': 
              return `rgba(255, 25, 25, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            case 'sacral': 
              return `rgba(255, 127, 0, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            case 'solar plexus': 
              return `rgba(255, 215, 0, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            case 'heart': 
              return `rgba(10, 215, 80, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            case 'throat': 
              return `rgba(0, 191, 255, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            case 'third eye': 
              return `rgba(138, 43, 226, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            case 'crown': 
              return `rgba(186, 85, 211, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
            default: 
              return `rgba(159, 122, 235, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
          }
        }
        
        return liftTheVeil ? 
          `rgba(255, 105, 180, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})` : 
          `rgba(159, 122, 235, ${0.8 + Math.sin(timestamp * 0.002) * 0.2})`;
      };
      
      const getHighlightColor = () => {
        if (currentAudio?.customData?.chakra) {
          switch (currentAudio.customData.chakra.toLowerCase()) {
            case 'root': return 'rgba(255, 65, 65, 1)';
            case 'sacral': return 'rgba(255, 165, 0, 1)';
            case 'solar plexus': return 'rgba(255, 255, 0, 1)';
            case 'heart': return 'rgba(50, 255, 150, 1)';
            case 'throat': return 'rgba(80, 220, 255, 1)';
            case 'third eye': return 'rgba(191, 64, 255, 1)';
            case 'crown': return 'rgba(236, 100, 255, 1)';
            default: return 'rgba(212, 122, 255, 1)';
          }
        }
        
        return liftTheVeil ? 'rgba(255, 105, 180, 1)' : 'rgba(212, 122, 255, 1)';
      };
      
      // Color cycling for rainbow effects
      const hue = (timestamp * 0.05) % 360;
      const getRainbowColor = (offset = 0) => {
        return `hsl(${(hue + offset) % 360}, 100%, 70%)`;
      };
      
      // Calculate rotation and pulsing based on audio
      const rotation = timestamp * 0.0003 * (1 + midEnergy * 0.5);
      const pulseFactor = 1 + Math.sin(timestamp * 0.002) * 0.05 + bassEnergy * 0.2;
      const scaledRadius = radius * pulseFactor;
      
      // Draw a subtle ambient glow at the center
      const ambient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
      ambient.addColorStop(0, getBaseColor().replace(')', ', 0.3)'));
      ambient.addColorStop(1, 'transparent');
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Draw sacred geometry based on selected mode
      switch (visualizerMode) {
        case 'flower':
          drawFlowerOfLife(ctx, scaledRadius, bassEnergy, midEnergy, highEnergy);
          break;
        case 'merkaba':
          drawMerkaba(ctx, scaledRadius, bassEnergy, midEnergy, highEnergy);
          break;
        case 'metatron':
          drawMetatronCube(ctx, scaledRadius, bassEnergy, midEnergy, highEnergy);
          break;
        case 'fractal':
          drawFractal(ctx, scaledRadius, bassEnergy, midEnergy, highEnergy, timestamp);
          break;
      }
      
      ctx.restore();
      
      // Helper functions for drawing the different sacred geometries
      function drawFlowerOfLife(
        ctx: CanvasRenderingContext2D, 
        radius: number, 
        bassEnergy: number, 
        midEnergy: number, 
        highEnergy: number
      ) {
        const baseColor = liftTheVeil ? getRainbowColor() : getBaseColor();
        const highlightColor = getHighlightColor();
        
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.5 + highEnergy * 3;
        
        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Apply glow effect when energy is high
        if (midEnergy > 0.4) {
          ctx.shadowColor = highlightColor;
          ctx.shadowBlur = 15 * midEnergy;
        }
        
        // First ring of circles
        const circleCount = 6;
        const innerRadius = radius * 0.55;
        
        for (let i = 0; i < circleCount; i++) {
          const angle = (i / circleCount) * Math.PI * 2;
          const x = Math.cos(angle) * innerRadius;
          const y = Math.sin(angle) * innerRadius;
          
          if (liftTheVeil) {
            ctx.strokeStyle = getRainbowColor(i * 60);
          }
          
          ctx.beginPath();
          ctx.arc(x, y, radius * (0.3 + bassEnergy * 0.1), 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Second ring - petal formation between the circles
        if (midEnergy > 0.2) {
          for (let i = 0; i < circleCount; i++) {
            const angle1 = (i / circleCount) * Math.PI * 2;
            const angle2 = ((i + 1) % circleCount / circleCount) * Math.PI * 2;
            
            const x1 = Math.cos(angle1) * innerRadius;
            const y1 = Math.sin(angle1) * innerRadius;
            const x2 = Math.cos(angle2) * innerRadius;
            const y2 = Math.sin(angle2) * innerRadius;
            
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const dist = Math.sqrt(midX * midX + midY * midY);
            const normMidX = midX / dist * innerRadius;
            const normMidY = midY / dist * innerRadius;
            
            if (liftTheVeil) {
              ctx.strokeStyle = getRainbowColor(i * 60 + 30);
            } else {
              ctx.strokeStyle = highlightColor;
            }
            
            ctx.globalAlpha = 0.5 + midEnergy * 0.5;
            ctx.beginPath();
            ctx.arc(normMidX, normMidY, radius * (0.3 + highEnergy * 0.1), 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
        
        // Outer ring for high energy
        if (bassEnergy > 0.3) {
          const outerCircleCount = 12;
          const outerRadius = radius * 0.85;
          
          ctx.globalAlpha = Math.min(1.0, bassEnergy);
          
          for (let i = 0; i < outerCircleCount; i++) {
            const angle = (i / outerCircleCount) * Math.PI * 2;
            const x = Math.cos(angle) * outerRadius;
            const y = Math.sin(angle) * outerRadius;
            
            if (liftTheVeil) {
              ctx.strokeStyle = getRainbowColor(i * 30);
            }
            
            const circleRadius = radius * (0.2 + ((dataArray[i * 2] || 0) / 255) * 0.15);
            
            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          ctx.globalAlpha = 1.0;
        }
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
      
      function drawMerkaba(
        ctx: CanvasRenderingContext2D,
        radius: number,
        bassEnergy: number,
        midEnergy: number,
        highEnergy: number
      ) {
        const baseColor = liftTheVeil ? getRainbowColor() : getBaseColor();
        const highlightColor = getHighlightColor();
        
        ctx.lineWidth = 2 + highEnergy * 4;
        
        // Apply glow effect based on energy levels
        if (midEnergy > 0.3) {
          ctx.shadowColor = highlightColor;
          ctx.shadowBlur = 15 * midEnergy;
        }
        
        // Star of David (two triangles) - the Merkaba
        const triangleRadius = radius * 0.8;
        const pulseUp = 1 + bassEnergy * 0.3;
        const pulseDown = 1 + midEnergy * 0.2;
        
        // Upward triangle
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
          const x = Math.cos(angle) * triangleRadius * pulseUp;
          const y = Math.sin(angle) * triangleRadius * pulseUp;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = liftTheVeil ? getRainbowColor() : baseColor;
        ctx.stroke();
        
        // Downward triangle
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 + Math.PI / 2;
          const x = Math.cos(angle) * triangleRadius * pulseDown;
          const y = Math.sin(angle) * triangleRadius * pulseDown;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = liftTheVeil ? getRainbowColor(180) : highlightColor;
        ctx.stroke();
        
        // Inner connections - only visible with higher energy
        if (highEnergy > 0.2) {
          ctx.globalAlpha = highEnergy;
          ctx.lineWidth = 1 + highEnergy * 2;
          
          for (let i = 0; i < 3; i++) {
            const angle1 = (i / 3) * Math.PI * 2 + Math.PI / 6;
            const angle2 = ((i + 1) % 3 / 3) * Math.PI * 2 + Math.PI / 2;
            
            const x1 = Math.cos(angle1) * triangleRadius * pulseUp;
            const y1 = Math.sin(angle1) * triangleRadius * pulseUp;
            
            const x2 = Math.cos(angle2) * triangleRadius * pulseDown;
            const y2 = Math.sin(angle2) * triangleRadius * pulseDown;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            ctx.strokeStyle = liftTheVeil ? getRainbowColor(i * 120) : 
              `rgba(${255 * midEnergy}, ${200 * bassEnergy}, ${255 * highEnergy}, ${highEnergy})`;
            
            ctx.stroke();
          }
          
          ctx.globalAlpha = 1.0;
        }
        
        // Center circle for balance
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.15 * (1 + midEnergy * 0.3), 0, Math.PI * 2);
        ctx.strokeStyle = liftTheVeil ? getRainbowColor(270) : highlightColor;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
      
      function drawMetatronCube(
        ctx: CanvasRenderingContext2D,
        radius: number,
        bassEnergy: number,
        midEnergy: number,
        highEnergy: number
      ) {
        const baseColor = liftTheVeil ? getRainbowColor() : getBaseColor();
        const highlightColor = getHighlightColor();
        
        ctx.lineWidth = 1.5 + highEnergy * 3;
        
        // Apply glow effect
        if (midEnergy > 0.25) {
          ctx.shadowColor = highlightColor;
          ctx.shadowBlur = 10 * midEnergy;
        }
        
        // Center circle (the Bindu point)
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.15 * (1 + bassEnergy * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle = liftTheVeil ? getRainbowColor() : baseColor;
        ctx.stroke();
        
        // Generate circle points in perfect Metatron's Cube arrangement
        const points = [];
        
        // First ring - 6 points
        const innerRadius = radius * 0.5;
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;
          const x = Math.cos(angle) * innerRadius;
          const y = Math.sin(angle) * innerRadius;
          points.push({ x, y });
          
          // Draw circles at each point
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.1 * (1 + midEnergy * 0.2), 0, Math.PI * 2);
          ctx.strokeStyle = liftTheVeil ? getRainbowColor(i * 60) : baseColor;
          ctx.stroke();
        }
        
        // Outer ring - 6 more points
        const outerRadius = radius * 0.75;
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3 + Math.PI / 6;
          const x = Math.cos(angle) * outerRadius;
          const y = Math.sin(angle) * outerRadius;
          points.push({ x, y });
          
          // Draw circles at each point
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.08 * (1 + highEnergy * 0.2), 0, Math.PI * 2);
          ctx.strokeStyle = liftTheVeil ? getRainbowColor(i * 60 + 30) : highlightColor;
          ctx.stroke();
        }
        
        // Connect inner points
        if (bassEnergy > 0.2) {
          ctx.lineWidth = 1 + bassEnergy * 2;
          ctx.globalAlpha = 0.7 + bassEnergy * 0.3;
          
          // Connect inner hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const point = points[i];
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.closePath();
          ctx.strokeStyle = liftTheVeil ? getRainbowColor(120) : baseColor;
          ctx.stroke();
          
          ctx.globalAlpha = 1.0;
        }
        
        // Connect with energy-based visibility
        if (midEnergy > 0.25 || highEnergy > 0.3) {
          // Calculate what connections to draw based on energy
          const connectCount = Math.floor(midEnergy * 30) + Math.floor(highEnergy * 30);
          
          ctx.lineWidth = 0.7 + midEnergy * 1.5;
          ctx.globalAlpha = 0.5 + midEnergy * 0.5;
          
          // Create interesting patterns by connecting specific points
          for (let i = 0; i < Math.min(points.length, connectCount); i++) {
            for (let j = i + 1; j < Math.min(points.length, connectCount); j++) {
              // Skip some connections based on energy to create evolving patterns
              if ((i + j) % Math.max(1, Math.floor(7 - midEnergy * 6)) !== 0) continue;
              
              const p1 = points[i];
              const p2 = points[j];
              
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              
              ctx.strokeStyle = liftTheVeil ? 
                getRainbowColor((i * j) % 360) : 
                `rgba(${Math.floor(159 + midEnergy * 96)}, ${Math.floor(122 + highEnergy * 133)}, 255, 0.7)`;
                
              ctx.stroke();
            }
          }
          
          ctx.globalAlpha = 1.0;
        }
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
      
      function drawFractal(
        ctx: CanvasRenderingContext2D,
        radius: number,
        bassEnergy: number,
        midEnergy: number,
        highEnergy: number,
        timestamp: number
      ) {
        const iterations = Math.min(7, 3 + Math.floor(highEnergy * 5));
        const angleOffset = timestamp * 0.0005;
        
        // Apply glow effect
        ctx.shadowColor = liftTheVeil ? getRainbowColor() : getHighlightColor();
        ctx.shadowBlur = 10 + highEnergy * 20;
        
        // Fractal recursion function
        function drawFractalCircles(x: number, y: number, radius: number, depth: number) {
          if (depth <= 0 || radius < 3) return;
          
          // Draw current circle
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          
          // Color based on depth and energy
          if (liftTheVeil) {
            ctx.strokeStyle = getRainbowColor(depth * 45 + timestamp * 0.05);
          } else {
            const depthColor = depth / iterations;
            ctx.strokeStyle = `rgba(${Math.floor(159 + depthColor * 96)}, ${Math.floor(122 + midEnergy * 133)}, 255, ${0.7 + depthColor * 0.3})`;
          }
          
          ctx.lineWidth = 2 - depth * 0.25;
          ctx.stroke();
          
          // Number of child circles based on energy
          const numChildren = depth == iterations ? 6 : Math.max(3, Math.floor(4 + midEnergy * 3));
          const childRadius = radius * (0.35 + midEnergy * 0.15);
          
          for (let i = 0; i < numChildren; i++) {
            const angle = angleOffset + (i / numChildren) * Math.PI * 2;
            const distance = radius * (0.7 + bassEnergy * 0.2);
            const childX = x + Math.cos(angle) * distance;
            const childY = y + Math.sin(angle) * distance;
            
            // Recursive call for child circles
            drawFractalCircles(childX, childY, childRadius, depth - 1);
          }
        }
        
        // Start the recursion from the center
        drawFractalCircles(0, 0, radius * 0.5 * (0.8 + bassEnergy * 0.4), iterations);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Add particles for high energy moments
        if (highEnergy > 0.5) {
          const particleCount = Math.floor(highEnergy * 30);
          
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = 1 + Math.random() * 3 * highEnergy;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = liftTheVeil ? getRainbowColor(i * 20) : getHighlightColor();
            ctx.globalAlpha = Math.random() * 0.7 + 0.3;
            ctx.fill();
          }
          
          ctx.globalAlpha = 1.0;
        }
      }
      
      // Continue animation
      requestAnimationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestAnimationRef.current = requestAnimationFrame(animate);
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
      window.removeEventListener('resize', updateCanvasSize);
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = null;
      }
    };
  }, [analyser, canvasRef.current, showVisualizer, isAudioPlaying, visualizerMode, liftTheVeil, currentAudio]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleVisualizer = () => {
    setShowVisualizer(!showVisualizer);
  };
  
  const changeVisualizerMode = () => {
    const modes = VISUALIZER_MODES.map(m => m.value);
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
  };

  const getCurrentVisualizerLabel = (): string => {
    const currentMode = VISUALIZER_MODES.find(m => m.value === visualizerMode);
    return currentMode?.label || 'Visualizer';
  };
  
  const handleClose = () => {
    if (isAudioPlaying) {
      togglePlayPause();
    }
    setCurrentAudio(null);
    sessionStorage.removeItem('currentAudio');
    sessionStorage.removeItem('isAudioPlaying');
    setExpanded(false);
    setPrimes([]);
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
    if (isFullscreen) setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setExpanded(true);
  };
  
  const getChakraColor = (): string => {
    if (!currentAudio?.customData?.chakra) return 'purple';
    
    switch (currentAudio.customData.chakra.toLowerCase()) {
      case 'root': return 'red';
      case 'sacral': return 'orange';
      case 'solar plexus': return 'yellow';
      case 'heart': return 'green';
      case 'throat': return 'blue';
      case 'third eye': return 'indigo';
      case 'crown': return 'violet';
      default: return 'purple';
    }
  };

  const getBgStyle = () => {
    if (liftTheVeil) {
      return isFullscreen 
        ? 'bg-black bg-opacity-95' 
        : 'bg-gradient-to-r from-pink-900/95 to-purple-900/95 shadow-lg shadow-pink-900/50';
    } else {
      return isFullscreen 
        ? 'bg-black bg-opacity-95'
        : 'bg-gradient-to-r from-purple-900/95 to-indigo-900/95 shadow-lg shadow-purple-900/50';
    }
  };

  if (!currentAudio) return null;

  return (
    <div className={`fixed ${isFullscreen ? 'inset-0 z-[100]' : 'bottom-4 right-4 z-50'} flex items-center justify-center`}>
      {activeTooltipPrime && isAudioPlaying && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[101]
          px-4 py-2 rounded-full backdrop-blur-sm shadow-lg text-white bg-black/70">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full animate-pulse bg-purple-400"></div>
            <span className="text-xs font-medium">✨ Prime Harmonic Detected: {activeTooltipPrime}</span>
          </div>
        </div>
      )}

      <div className={`
        ${isFullscreen ? 'w-full h-full' : expanded ? 'w-[520px]' : 'w-[320px]'}
        relative rounded-lg overflow-hidden shadow-xl border border-white/10 ${getBgStyle()}
        ${isFullscreen ? '' : 'transition-all duration-300 ease-in-out'}
      `}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          {showVisualizer && isAudioPlaying && (
            <canvas 
              ref={canvasRef}
              className="w-full h-full"
            />
          )}
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/90 hover:text-white mr-2"
                onClick={toggleExpand}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <div className="truncate max-w-[200px]">
                <p className="font-medium text-sm text-white/90 truncate">{currentAudio.title}</p>
                {currentAudio.artist && (
                  <p className="text-xs text-white/70 truncate">{currentAudio.artist}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/70 hover:text-white"
                onClick={toggleVisualizer}
                title={showVisualizer ? "Hide visualizer" : "Show visualizer"}
              >
                {showVisualizer ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              
              {showVisualizer && isAudioPlaying && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/70 hover:text-white"
                      onClick={changeVisualizerMode}
                      title="Change visualizer style"
                    >
                      <BarChart4 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mode: {getCurrentVisualizerLabel()}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/70 hover:text-white"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-300 hover:text-red-400"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="p-4 space-y-4">
              {(currentAudio.customData?.frequency || detectedFrequency || primes.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {currentAudio.customData?.frequency && (
                    <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                      {currentAudio.customData.frequency} Hz
                    </Badge>
                  )}
                  {currentAudio.customData?.chakra && (
                    <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                      {currentAudio.customData.chakra} Chakra
                    </Badge>
                  )}
                  {detectedFrequency && (
                    <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                      Current: ~{detectedFrequency} Hz
                    </Badge>
                  )}
                  {primes.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white cursor-help`}>
                          {primes.length} Primes Found
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Prime Harmonics: {primes.slice(-5).join(', ')}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Prime frequencies align with sacred harmonic fields
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
  
              {currentAudio.imageUrl && (
                <div className="w-full h-40 bg-gray-900 dark:bg-gray-800 rounded-md overflow-hidden mb-4">
                  <img 
                    src={currentAudio.imageUrl} 
                    alt={currentAudio.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {isAudioPlaying && showVisualizer && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                  <Badge 
                    className={`px-3 py-1 flex items-center gap-2 ${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white opacity-90 backdrop-blur-sm`}
                  >
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span className="capitalize">{getCurrentVisualizerLabel()}</span>
                  </Badge>
                </div>
              )}
              
              {(!isAudioPlaying || !showVisualizer) && (
                <div className="flex justify-center my-6">
                  <div className="relative">
                    <Button
                      variant="default"
                      size="icon"
                      className={`h-16 w-16 rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                      onClick={togglePlayPause}
                      disabled={!audioLoaded}
                    >
                      {isAudioPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                    <div className={`absolute inset-0 rounded-full ${liftTheVeil ? 'bg-pink-500' : 'bg-purple-500'} opacity-10 animate-ping`} />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/70">
                  <span>{formatTime(currentAudioTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentAudioTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={(values) => seekTo(values[0])}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={() => seekTo(Math.max(0, currentAudioTime - 10))}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="icon"
                    className={`h-10 w-10 rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    onClick={togglePlayPause}
                    disabled={!audioLoaded}
                  >
                    {isAudioPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={() => seekTo(Math.min(duration, currentAudioTime + 10))}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>
              
              {audioError && (
                <p className="text-red-500 text-xs mt-2">Error: {audioError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
