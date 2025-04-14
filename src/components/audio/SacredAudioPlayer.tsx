
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

const SacredAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    currentTrack,
    audioRef,
    seekTo
  } = useAudioPlayer();
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const { liftTheVeil } = useTheme();
  
  // Player state
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  
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

  // Connect audio analyzer to the audio element
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  // Set up canvas sizing and observe resize events
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
    
    // Also listen for window resize events
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [expanded]);

  // Draw the sacred geometry visualizer
  const drawVisualizer = () => {
    if (!canvasRef.current || !audioData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate average amplitude for visualization intensity
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i];
    }
    const averageAmplitude = sum / audioData.length / 255; // Normalized to 0-1
    
    // Get center point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw seed of life (central circle)
    const seedRadius = Math.min(canvas.width, canvas.height) * 0.1 * (1 + averageAmplitude * 0.3);
    
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
    
    // Draw flower of life patterns - expanding circles
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const distance = seedRadius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(x, y, seedRadius * (0.5 + averageAmplitude * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = typeof mainColor === 'string' 
        ? `${mainColor}40` // More transparent
        : mainColor;
      ctx.fill();
    }
    
    // Add time-based animations - pulsing outer ring
    const time = performance.now() / 1000;
    const pulseFactor = 1 + Math.sin(time * 2) * 0.1;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, seedRadius * 2 * pulseFactor, 0, Math.PI * 2);
    ctx.strokeStyle = typeof mainColor === 'string' ? mainColor : '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Create new circles based on audio characteristics
    if (isPlaying && audioData) {
      // Check if current frequency is a prime number or close to one
      const currentFrequency = currentTrack?.customData?.frequency || 0;
      const isPrimeOrClose = primeNumbers.some(prime => 
        Math.abs(currentFrequency - prime) < 5 || 
        Math.abs(currentFrequency % prime) < 5
      );
      
      // Create prime frequency blooms
      if (isPrimeOrClose && Math.random() > 0.9) {
        const angle = Math.random() * Math.PI * 2;
        const distance = seedRadius * (1 + Math.random());
        
        circlesRef.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: seedRadius * (0.3 + Math.random() * 0.3),
          opacity: 0.7,
          color: liftTheVeil 
            ? `hsla(${Math.random() * 360}, 100%, 70%, 0.7)` 
            : typeof mainColor === 'string' ? mainColor : '#8B5CF6'
        });
      }
      
      // Add frequency-reactive ripples
      if (averageAmplitude > 0.4 && Math.random() > 0.8) {
        circlesRef.current.push({
          x: centerX,
          y: centerY,
          radius: seedRadius * 0.8,
          opacity: 0.5,
          color: typeof mainColor === 'string' ? mainColor : '#8B5CF6'
        });
      }
    }
    
    // Draw and update all circles
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    circlesRef.current = circlesRef.current.filter(circle => {
      // Update circle properties for animation
      circle.radius += 1;
      circle.opacity -= 0.01;
      
      if (circle.opacity <= 0 || circle.radius > maxRadius) {
        return false; // Remove the circle
      }
      
      // Draw the circle
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      
      const colorString = circle.color.startsWith('hsl') 
        ? circle.color.replace(')', `, ${circle.opacity})`) 
        : circle.color.startsWith('rgb')
          ? circle.color.replace(')', `, ${circle.opacity})`)
          : `${circle.color}${Math.floor(circle.opacity * 255).toString(16).padStart(2, '0')}`;
      
      ctx.fillStyle = colorString;
      ctx.fill();
      
      return true; // Keep the circle
    });
    
    // Reset shadow for other elements
    ctx.shadowBlur = 0;
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  };

  // Update audio data for visualization
  useEffect(() => {
    if (!analyser || !isPlaying) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(dataArray);
    };
    
    const intervalId = setInterval(updateAudioData, 50);
    
    return () => clearInterval(intervalId);
  }, [analyser, isPlaying]);

  // Start/stop the visualizer based on component mount/unmount and play state
  useEffect(() => {
    if (isPlaying && canvasRef.current) {
      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, canvasSize, audioData]);

  // Handle volume change
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audioRef]);
  
  // Toggle mute function
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  // Format time for display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle seeking on progress bar click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    
    seekTo(newTime);
  };
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  return (
    <motion.div 
      className={`fixed bottom-4 right-4 z-[1000] rounded-xl overflow-hidden sacred-audio-player ${isPlaying ? 'is-playing' : ''} ${liftTheVeil ? 'veil-lifted' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        boxShadow: `0 0 20px ${liftTheVeil ? 'rgba(255, 105, 180, 0.7)' : 'rgba(139, 92, 246, 0.7)'}`,
        width: expanded ? '300px' : '160px',
        height: expanded ? '200px' : '80px',
        transition: 'width 0.3s ease, height 0.3s ease'
      }}
    >
      <div className="relative w-full h-full">
        {/* Canvas layer for visualization */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full sacred-geometry-canvas rounded-lg"
          style={{ opacity: 0.9 }}
        />
        
        {/* Controls layer */}
        <div className="relative z-10 flex flex-col p-2 h-full">
          {expanded && (
            <div className="flex justify-between items-center mb-2">
              <div className="text-white text-xs truncate max-w-[200px]">
                {currentTrack?.title || 'Sacred Audio'}
                {currentTrack?.artist && <span className="opacity-70"> • {currentTrack.artist}</span>}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpanded}
                className="p-1 text-white/70 hover:text-white"
              >
                <Minimize2 size={16} />
              </motion.button>
            </div>
          )}
          
          {/* Progress bar (expanded view only) */}
          {expanded && (
            <div 
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-white/70 rounded-full"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
          )}
          
          {/* Main controls */}
          <div className={`flex ${expanded ? 'justify-between' : 'justify-center'} items-center h-${expanded ? 'auto' : 'full'}`}>
            {/* Play/Pause button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className={`${expanded ? 'px-4 py-2' : 'px-3 py-1.5'} bg-white text-black rounded flex items-center gap-1 hover:bg-opacity-90`}
            >
              {isPlaying ? (
                <>
                  <Pause size={expanded ? 16 : 14} /> <span>{expanded ? 'Pause' : ''}</span>
                </>
              ) : (
                <>
                  <Play size={expanded ? 16 : 14} /> <span>{expanded ? 'Play' : ''}</span>
                </>
              )}
            </motion.button>
            
            {/* Time display (expanded view only) */}
            {expanded && (
              <div className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
            )}
            
            {/* Volume control (expanded view only) */}
            {expanded && (
              <div className="relative flex items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-1 text-white"
                  onMouseEnter={() => setShowVolume(true)}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </motion.button>
                
                {showVolume && (
                  <div 
                    className="absolute bottom-full right-0 p-2 bg-black/80 rounded-lg mb-2"
                    onMouseEnter={() => setShowVolume(true)}
                    onMouseLeave={() => setShowVolume(false)}
                  >
                    <Slider
                      value={[volume * 100]}
                      min={0}
                      max={100}
                      step={1}
                      className="w-24"
                      onValueChange={(value) => setVolume(value[0] / 100)}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Expand button (collapsed view only) */}
            {!expanded && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpanded}
                className="ml-2 p-1 text-white/70 hover:text-white"
              >
                <Maximize2 size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SacredAudioPlayer;
