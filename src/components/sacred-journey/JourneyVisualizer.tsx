
import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface JourneyVisualizerProps {
  visualEffects?: string;
  strobePatterns?: string;
  audioUrl?: string;
}

const JourneyVisualizer: React.FC<JourneyVisualizerProps> = ({ 
  visualEffects, 
  strobePatterns, 
  audioUrl 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [activeEffect, setActiveEffect] = useState('default');

  useEffect(() => {
    // Parse visual effects if provided
    let effectsConfig;
    try {
      effectsConfig = visualEffects ? JSON.parse(visualEffects) : { type: 'default' };
      setActiveEffect(effectsConfig.type || 'default');
    } catch (e) {
      console.error('Error parsing visual effects config:', e);
      effectsConfig = { type: 'default' };
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize audio if URL provided
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('canplaythrough', () => {
        setAudioLoaded(true);
        toast.success('Journey audio loaded and ready');
      });
      
      audioRef.current.addEventListener('error', () => {
        toast.error('Failed to load journey audio');
      });
      
      try {
        // Set up Web Audio API for visualization
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        console.error('Error setting up audio visualization:', e);
      }
    }
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      animationRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get audio data if available
      if (analyserRef.current && dataArrayRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      }
      
      // Render visualization based on effect type
      switch (activeEffect) {
        case 'waves':
          renderWaveEffect(ctx, canvas);
          break;
        case 'particles':
          renderParticleEffect(ctx, canvas);
          break;
        case 'pulse':
          renderPulseEffect(ctx, canvas);
          break;
        default:
          renderDefaultEffect(ctx, canvas);
      }
    };
    
    // Start animation
    animate();
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [visualEffects, audioUrl]);
  
  // Play/pause audio
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Resume or start audio context if needed
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      audioRef.current.play().catch(e => {
        console.error('Error playing audio:', e);
        toast.error('Unable to play audio. Try interacting with the page first.');
      });
      
      setIsPlaying(true);
    }
  };
  
  // Effect renderers
  const renderDefaultEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.2)');
    gradient.addColorStop(1, 'rgba(75, 0, 130, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floating circles
    const time = Date.now() / 2000;
    for (let i = 0; i < 20; i++) {
      const x = canvas.width * (0.1 + 0.8 * Math.sin(time + i * 0.3));
      const y = canvas.height * (0.1 + 0.8 * Math.cos(time + i * 0.5));
      const radius = 5 + 15 * Math.sin(time + i);
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(time * 50 + i * 20) % 360}, 70%, 60%, 0.3)`;
      ctx.fill();
    }
  };
  
  const renderWaveEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() / 1000;
    
    ctx.fillStyle = 'rgba(0, 0, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x += 10) {
        const amp = dataArrayRef.current ? dataArrayRef.current[i * 10] / 5 : 50;
        const y = canvas.height / 2 + 
                Math.sin(x * 0.01 + time + i) * amp * Math.sin(time * 0.5);
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = `hsla(${(time * 20 + i * 40) % 360}, 70%, 60%, 0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };
  
  const renderParticleEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const particles = 100;
    const time = Date.now() / 1000;
    
    ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles; i++) {
      const x = canvas.width * (0.5 + 0.4 * Math.cos(time + i * 0.1));
      const y = canvas.height * (0.5 + 0.4 * Math.sin(time + i * 0.1));
      const size = dataArrayRef.current ? dataArrayRef.current[i % dataArrayRef.current.length] / 10 : 5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(i * 3) % 360}, 100%, 50%, 0.7)`;
      ctx.fill();
    }
  };
  
  const renderPulseEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() / 1000;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const maxRadius = Math.min(centerX, centerY);
    const rings = 5;
    
    for (let i = 0; i < rings; i++) {
      const baseRadius = (i + 1) * maxRadius / rings;
      const phase = time * (0.5 + i * 0.1);
      const pulseRadius = baseRadius + Math.sin(phase) * 20;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${(time * 30 + i * 60) % 360}, 80%, 60%, ${0.8 - i * 0.15})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <div className="relative mb-8">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[300px] rounded-lg"
      />
      
      {audioUrl && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={toggleAudio}
            disabled={!audioLoaded}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
          >
            {isPlaying ? 'Pause' : 'Play'} Audio
          </button>
        </div>
      )}
      
      <div className="absolute top-4 left-4 flex space-x-2">
        {['default', 'waves', 'particles', 'pulse'].map(effect => (
          <button
            key={effect}
            onClick={() => setActiveEffect(effect)}
            className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
              activeEffect === effect 
                ? 'bg-purple-700 text-white' 
                : 'bg-white/80 text-purple-700 hover:bg-purple-100'
            }`}
          >
            {effect}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JourneyVisualizer;
