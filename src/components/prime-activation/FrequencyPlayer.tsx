
import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FrequencyPlayerProps {
  onPlay: (frequency: number) => void;
  activeFrequency: number | null;
}

interface ToneInfo {
  frequency: number;
  name: string;
  chakra: string;
  color: string;
  description: string;
  affirmation: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({ onPlay, activeFrequency }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTone, setCurrentTone] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Prime frequencies aligned with chakra and energetic properties
  const tones: ToneInfo[] = [
    {
      frequency: 221,
      name: "Root Stability",
      chakra: "Root",
      color: "from-red-700 to-red-500",
      description: "Grounds energy and creates a secure foundation",
      affirmation: "I am safe. I am secure. I am grounded."
    },
    {
      frequency: 272,
      name: "Creative Flow",
      chakra: "Sacral",
      color: "from-orange-600 to-orange-400",
      description: "Enhances creative expression and emotional balance",
      affirmation: "I embrace my creativity. I flow with life's changes."
    },
    {
      frequency: 304,
      name: "Personal Power",
      chakra: "Solar Plexus",
      color: "from-yellow-500 to-amber-400",
      description: "Strengthens will power and confidence",
      affirmation: "I claim my path. I lead with truth."
    },
    {
      frequency: 528,
      name: "Heart Harmony",
      chakra: "Heart",
      color: "from-green-600 to-green-400",
      description: "Known as the 'Love Frequency', heals DNA and relationships",
      affirmation: "I am open to love. I give and receive freely."
    },
    {
      frequency: 639,
      name: "Expression",
      chakra: "Throat",
      color: "from-blue-600 to-blue-400",
      description: "Enhances communication and self-expression",
      affirmation: "I speak my truth with clarity and confidence."
    }
  ];
  
  useEffect(() => {
    // Clean up audio on component unmount
    return () => {
      stopTone();
    };
  }, []);
  
  const playTone = (frequency: number) => {
    try {
      // Stop any currently playing tone
      stopTone();
      
      // Create new audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Create oscillator (tone generator)
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine'; // Pure sine wave
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      
      // Connect nodes: oscillator -> gain -> destination
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set initial volume to 0 and gradually increase (fade in)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.5);
      
      // Start oscillator
      oscillator.start();
      
      // Set fade-out after 4-5 seconds
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 5);
      oscillator.stop(audioContext.currentTime + 5.1);
      
      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      // Update state
      setIsPlaying(true);
      setCurrentTone(frequency);
      onPlay(frequency);
      
      // Auto-stop after tone completes
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentTone(null);
      }, 5100);
      
    } catch (error) {
      console.error('Error playing tone:', error);
    }
  };
  
  const stopTone = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      
      setIsPlaying(false);
      setCurrentTone(null);
    } catch (error) {
      console.error('Error stopping tone:', error);
    }
  };
  
  const getChakraEmoji = (chakra: string) => {
    switch(chakra) {
      case 'Root': return '🔴';
      case 'Sacral': return '🟠';
      case 'Solar Plexus': return '🟡';
      case 'Heart': return '💚';
      case 'Throat': return '🔵';
      default: return '🔮';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-playfair text-amber-200">Prime Frequency Activation</h2>
        <p className="text-purple-200">Select a frequency to begin vibrational alignment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tones.map((tone) => (
          <div 
            key={tone.frequency}
            className={`rounded-lg p-4 transition-all ${
              currentTone === tone.frequency 
                ? `bg-gradient-to-r ${tone.color} shadow-lg shadow-${tone.color.split('-')[0]}-500/30 scale-105`
                : 'bg-gray-800/40 hover:bg-gray-700/40'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <span className="mr-2">{getChakraEmoji(tone.chakra)}</span>
                <h3 className="font-medium">{tone.name}</h3>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-black/30">
                {tone.frequency} Hz
              </span>
            </div>
            
            <p className="text-sm mb-4 opacity-80">{tone.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs italic">{tone.chakra} Chakra</span>
              
              <Button
                onClick={() => playTone(tone.frequency)}
                disabled={isPlaying && currentTone !== tone.frequency}
                size="sm"
                variant={currentTone === tone.frequency ? "default" : "outline"}
                className={`${currentTone === tone.frequency ? 'bg-white text-black' : ''}`}
              >
                {currentTone === tone.frequency ? (
                  <Square className="h-4 w-4 mr-1" />
                ) : (
                  <Play className="h-4 w-4 mr-1" />
                )}
                {currentTone === tone.frequency ? 'Stop' : 'Play'}
              </Button>
            </div>
            
            {/* Display affirmation only for active tone */}
            {currentTone === tone.frequency && (
              <div className="mt-4 p-2 text-center rounded bg-white/10">
                <p className="text-sm italic font-playfair">{tone.affirmation}</p>
              </div>
            )}
            
            {/* Visualize chakra activation when playing */}
            {currentTone === tone.frequency && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-16 h-16">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${tone.color} opacity-60 animate-pulse`}></div>
                  <div className="absolute inset-2 rounded-full bg-white/20"></div>
                  <div className="absolute inset-4 rounded-full bg-white/30"></div>
                  <div className="absolute inset-6 rounded-full bg-white/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-indigo-900/30 rounded-lg">
        <h3 className="text-center text-lg mb-3">Sacred Geometry Visualization</h3>
        <div className="h-48 flex items-center justify-center">
          {currentTone ? (
            <div className="relative w-40 h-40">
              {/* Dynamically render shape based on frequency */}
              {currentTone === 221 && (
                <div className="absolute inset-0 border-2 border-red-400 rounded"></div>
              )}
              {currentTone === 272 && (
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M50,10 L90,90 L10,90 Z" fill="none" stroke="orange" strokeWidth="2" />
                  </svg>
                </div>
              )}
              {currentTone === 304 && (
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M50,10 L90,90 L10,90 Z" fill="none" stroke="yellow" strokeWidth="2" />
                    <path d="M50,90 L90,10 L10,10 Z" fill="none" stroke="yellow" strokeWidth="2" />
                  </svg>
                </div>
              )}
              {currentTone === 528 && (
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="green" strokeWidth="2" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="green" strokeWidth="2" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="green" strokeWidth="2" />
                  </svg>
                </div>
              )}
              {currentTone === 639 && (
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M50,10 A40,40 0 1,0 50,90 A40,40 0 1,0 50,10" fill="none" stroke="blue" strokeWidth="2" />
                  </svg>
                </div>
              )}
              
              {/* Pulse animation for all frequencies */}
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            <p className="text-purple-300 opacity-50">Select a frequency to see visualization</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrequencyPlayer;
