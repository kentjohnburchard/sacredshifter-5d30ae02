import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToneInfoCard from './ToneInfoCard';
import toneMetadata from '@/data/toneMetadata.json';

interface FrequencyPlayerProps {
  onPlay: (frequency: number) => void;
  activeFrequency: number | null;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({ onPlay, activeFrequency }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTone, setCurrentTone] = useState<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  type ToneMeta = {
    frequency: number;
    chakra: string;
    color: string;
    archetype: string;
    description: string;
  };
  const metadata: Record<number, ToneMeta> = {};
  (toneMetadata as ToneMeta[]).forEach(tm => {
    metadata[Number(tm.frequency)] = { ...tm, frequency: Number(tm.frequency) };
  });

  const tones: number[] = (toneMetadata as ToneMeta[]).map(t => Number(t.frequency));

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  const playTone = (frequency: number) => {
    try {
      stopTone();
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.5);

      oscillator.start();
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 5);
      oscillator.stop(audioContext.currentTime + 5.1);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      setIsPlaying(true);
      setCurrentTone(frequency);
      onPlay(frequency);

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

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-playfair text-amber-200">Prime Frequency Activation</h2>
        <p className="text-purple-200">Select a frequency to begin vibrational alignment</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tones.map(frequency => {
          const tone = metadata[frequency];
          const isActive = currentTone === frequency;
          return (
            <div key={frequency} className="flex flex-col items-stretch">
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  position: "relative",
                }}
              >
                <Button
                  onClick={() => playTone(frequency)}
                  disabled={isPlaying && !isActive}
                  size="lg"
                  aria-label={`Play ${frequency} Hz`}
                  className={`relative transition-all font-bold text-lg border-2 mb-2`}
                  style={{
                    borderColor: tone.color,
                    color: isActive ? '#232044' : tone.color,
                    background: isActive
                      ? `radial-gradient(ellipse at center, ${tone.color}80 60%, #1e1b40cc 100%)`
                      : "#19162a",
                    boxShadow: isActive
                      ? `0 0 18px 4px ${tone.color}, 0 0 54px 12px ${tone.color}44`
                      : `0 0 8px 1px ${tone.color}55`,
                  }}
                >
                  {isActive ? (
                    <Square className="h-6 w-6 mr-2" />
                  ) : (
                    <Play className="h-6 w-6 mr-2" />
                  )}
                  {frequency} Hz
                </Button>
                <span
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all`}
                  style={{
                    width: isActive ? 100 : 70,
                    height: isActive ? 100 : 70,
                    boxShadow: isActive
                      ? `0 0 38px 14px ${tone.color}99, 0 0 120px 30px ${tone.color}77`
                      : `0 0 18px 8px ${tone.color}66`,
                    border: `5px solid ${tone.color}`,
                    opacity: isActive ? 0.45 : 0.22,
                    zIndex: 0,
                  }}
                  aria-hidden
                />
              </div>
              <ToneInfoCard
                frequency={tone.frequency}
                chakra={tone.chakra}
                color={tone.color}
                archetype={tone.archetype}
                description={tone.description}
                isPlaying={isActive}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-8 p-4 bg-indigo-900/30 rounded-lg">
        <h3 className="text-center text-lg mb-3">Sacred Geometry Visualization</h3>
        <div className="h-48 flex items-center justify-center">
          {currentTone ? (
            <div className="relative w-40 h-40">
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
