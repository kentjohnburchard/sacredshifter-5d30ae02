
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Clock, RotateCcw } from "lucide-react";
import { HealingFrequency } from "@/data/frequencies";

interface FrequencyPlayerProps {
  frequency: HealingFrequency;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({ frequency }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const maxDuration = frequency.duration || 300; // 5 minutes default
  
  // Initialize or update the audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Effect to handle frequency changes
  useEffect(() => {
    if (isPlaying) {
      stopSound();
      playSound();
    }
    
    // Reset elapsed time when changing frequency
    setElapsedTime(0);
  }, [frequency.id]);
  
  // Effect to handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Effect to track elapsed time
  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= maxDuration) {
            stopSound();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, maxDuration]);
  
  const playSound = () => {
    if (!audioContextRef.current) return;
    
    // Create oscillator
    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine'; // sine wave creates the purest tone
    oscillator.frequency.setValueAtTime(frequency.frequency, audioContextRef.current.currentTime);
    
    // Create gain node for volume control
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = isMuted ? 0 : volume;
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    // Start oscillator
    oscillator.start();
    
    // Store references
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    setIsPlaying(true);
  };
  
  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound();
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    if (values[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const resetPlayer = () => {
    stopSound();
    setElapsedTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Music bars animation effect
  const renderMusicBars = () => {
    if (!isPlaying) return null;
    
    return (
      <div className="absolute top-0 right-0 mr-4 mt-4 music-bars">
        <div className="music-bar h-3 animate-music-bar-1"></div>
        <div className="music-bar h-4 animate-music-bar-2"></div>
        <div className="music-bar h-2 animate-music-bar-3"></div>
        <div className="music-bar h-5 animate-music-bar-4"></div>
      </div>
    );
  };
  
  return (
    <Card className="relative border-none shadow-xl glass bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden">
      {renderMusicBars()}
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-xl text-white">
                <span className={`bg-gradient-to-r ${frequency.color} bg-clip-text text-transparent`}>
                  {frequency.frequency} Hz
                </span>
                <span className="ml-2 text-white">{frequency.name}</span>
              </h3>
              <p className="text-sm text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {formatTime(elapsedTime)} / {formatTime(maxDuration)}
                </span>
              </p>
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-white/10">
              <div
                style={{ width: `${(elapsedTime / maxDuration) * 100}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${frequency.color}`}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                onClick={resetPlayer}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className={`h-12 w-12 rounded-full bg-gradient-to-r ${frequency.color} hover:opacity-90 transition-opacity shadow-lg`}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white ml-0.5" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-300 hover:bg-white/10 hover:text-white"
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
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyPlayer;
