
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const chakraColors: Record<string, string> = {
  root: '#FF0000',
  sacral: '#FFA500',
  solar: '#FFFF00',
  heart: '#00FF00',
  throat: '#00FFFF',
  thirdEye: '#0000FF',
  crown: '#EE82EE',
};

const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

const SacredAudioPlayer: React.FC = () => {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    togglePlay,
    duration,
    currentTime,
    setCurrentTime,
    audioContext,
  } = useAudioPlayer();

  const { liftTheVeil } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const circlesRef = useRef<any[]>([]);
  const audioNodeConnectedRef = useRef<boolean>(false);
  const maxCircles = 50;

  // Setup audio analyser
  useEffect(() => {
    // Only connect once
    if (audioNodeConnectedRef.current || !audioContext || !audioRef.current) return;
    
    try {
      console.log("Setting up audio analyzer");
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;
      
      // Create media element source only if not already connected
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyserNode);
      analyserNode.connect(audioContext.destination);
      
      setAnalyser(analyserNode);
      audioNodeConnectedRef.current = true;
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
    }
    
    return () => {
      // Cleanup function - we don't disconnect because the audio element persists
      // and we only want to connect once during the app's lifetime
      console.log("SacredAudioPlayer component unmounting, but keeping audio context connected");
    };
  }, [audioContext, audioRef]);

  // Canvas animation effect
  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      const animationId = requestAnimationFrame(draw);
      
      // If component is unmounted or hidden, stop the animation
      if (!canvas.isConnected) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Add new circle for prime frequency or at intervals
      const maxValue = Math.max(...Array.from(dataArray));
      const dominantIndex = Array.from(dataArray).indexOf(maxValue);
      const dominantFreq = Math.round(dominantIndex * (audioContext.sampleRate / 2) / bufferLength);

      const isPrime = primeNumbers.includes(dominantFreq);

      if (isPrime && circlesRef.current.length < maxCircles) {
        circlesRef.current.push({
          x: centerX,
          y: centerY,
          radius: 10,
          opacity: 1,
          color: liftTheVeil ? '#FF69B4' : '#A855F7'
        });
      }

      // Update and draw each circle
      circlesRef.current.forEach((circle, index) => {
        circle.radius += 1;
        circle.opacity -= 0.01;
        if (circle.opacity <= 0) {
          circlesRef.current.splice(index, 1);
          return;
        }
        
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `${circle.color}${Math.floor(circle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Bonus: draw flower of life origin circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30 + Math.sin(Date.now() / 400) * 5, 0, 2 * Math.PI);
      ctx.strokeStyle = liftTheVeil ? '#FF69B4' : '#A855F7';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const animationId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, liftTheVeil, audioContext]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all 
        ${liftTheVeil ? 'bg-pink-900/40 border-pink-500' : 'bg-purple-900/40 border-purple-500'} 
        border w-[320px]`}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="mb-3 rounded-lg w-full"
      />
      <div className="flex justify-between items-center text-white">
        <div className="font-bold text-sm">
          {currentTrack?.title || 'No Track'}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="px-3 py-1 bg-white text-black rounded flex items-center gap-1"
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
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
        className="w-full mt-2"
      />
    </div>
  );
};

export default SacredAudioPlayer;
