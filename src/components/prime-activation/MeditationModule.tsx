import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MeditationModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Meditation audio source (would normally be hosted in public folder)
  // Using a placeholder URL for demo
  const audioSource = "/sounds/focus-ambient.mp3"; 

  // Initialize audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audioElement.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
      setAudioLoaded(true);
    };

    const handleEnded = () => {
      // Loop the audio
      setCurrentTime(0);
      audioElement.currentTime = 0;
      audioElement.play().catch(err => console.error("Error auto-replaying audio:", err));
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Simple time formatter as replacement for formatTime utility
  const formatTimeSimple = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error("Error playing audio:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seeking in the audio track
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-playfair text-amber-200">304Hz Activation Module</h2>
        <p className="text-purple-200 mb-2">Solar Plexus Alignment</p>
        <div className="max-w-md mx-auto">
          <p className="text-amber-100 font-playfair text-xl italic my-4">
            "I claim my path. I lead with truth."
          </p>
        </div>
      </div>

      {/* Main meditation player */}
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-amber-600/20 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className={`p-3 rounded-full ${isPlaying ? 'bg-yellow-500/20 pulse-animation' : 'bg-gray-800/50'}`}>
            <Headphones className="h-10 w-10 text-amber-300" />
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-medium text-amber-200">304 Hz Meditation</h3>
          <p className="text-xs text-yellow-100/70">Solar Plexus Activation</p>
        </div>

        {/* Audio element (hidden) */}
        <audio ref={audioRef} src={audioSource} loop></audio>

        {/* Custom audio controls */}
        <div className="space-y-3">
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="h-2 bg-gray-700/50 rounded-full cursor-pointer" 
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>

          {/* Time indicators and control button */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-300">
              {formatTimeSimple(currentTime)}
            </div>
            
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size="sm"
              className="rounded-full h-10 w-10 flex items-center justify-center p-0 bg-yellow-600/30 border-yellow-500/30 hover:bg-yellow-500/30"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-amber-200" />
              ) : (
                <Play className="h-4 w-4 ml-0.5 text-amber-200" />
              )}
            </Button>
            
            <div className="text-xs text-gray-300">
              {formatTimeSimple(duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Light Effects */}
      <div className="mt-10 text-center">
        <h3 className="text-lg mb-4">Ambient Light Settings</h3>
        <div className="flex justify-center gap-3">
          <Button 
            variant="ghost" 
            className="bg-blue-900/20 hover:bg-blue-800/40 text-blue-200"
          >
            Cosmic Blue
          </Button>
          <Button 
            variant="ghost" 
            className="bg-yellow-900/20 hover:bg-yellow-800/40 text-yellow-200"
          >
            Golden Aura
          </Button>
          <Button 
            variant="ghost" 
            className="bg-purple-900/20 hover:bg-purple-800/40 text-purple-200"
          >
            Sacred Violet
          </Button>
        </div>
      </div>
      
      {/* Activating visualization */}
      <div className="mt-8">
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            {/* Mandala-like sacred geometry visualization */}
            <div className={`absolute inset-0 rounded-full border-2 border-yellow-500/50 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '30s' }}></div>
            <div className={`absolute inset-3 rounded-full border-2 border-yellow-400/40 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
            <div className={`absolute inset-6 rounded-full border-2 border-amber-500/30 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '20s' }}></div>
            
            {/* Inner star */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <g className={isPlaying ? 'animate-pulse' : ''} style={{ transformOrigin: 'center' }}>
                  <polygon 
                    points="50,10 61.8,35.4 90.1,35.4 67.3,52.3 76.9,79.6 50,63.6 23.1,79.6 32.7,52.3 9.9,35.4 38.2,35.4" 
                    fill="none" 
                    stroke={isPlaying ? "#fcd34d" : "#78350f"} 
                    strokeWidth="2" 
                  />
                </g>
              </svg>
            </div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full"></div>
            
            {/* Outer pulse for active player */}
            {isPlaying && (
              <div className="absolute -inset-4 rounded-full border border-yellow-400/20 animate-ping" style={{ animationDuration: '2s' }}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationModule;
