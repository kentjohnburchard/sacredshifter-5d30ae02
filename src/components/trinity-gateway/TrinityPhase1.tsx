import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { toast } from "sonner";
import { getFrequencyAudioUrl } from "@/utils/focusTrackMap";

interface TrinityPhase1Props {
  onComplete: () => void;
  skipPhase?: () => void;
}

const TrinityPhase1: React.FC<TrinityPhase1Props> = ({ onComplete, skipPhase }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [teslaQuoteShown, setTeslaQuoteShown] = useState(false);
  
  const PHASE_DURATION = 180; // 3 minutes in seconds
  
  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info("Beginning Phase 1: Release (396Hz)");
    } else {
      toast.info("Frequency paused");
    }
  }, [isPlaying]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => {
          const newSeconds = prev + 1;
          setProgress((newSeconds / PHASE_DURATION) * 100);
          
          if (newSeconds === 33 && !teslaQuoteShown) {
            toast.info("\"If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.\" — Tesla");
            setTeslaQuoteShown(true);
          }
          
          if (newSeconds >= PHASE_DURATION) {
            setIsPlaying(false);
            setTimeout(() => onComplete(), 1000);
            toast.success("Phase 1 complete: Root chakra released");
            return PHASE_DURATION;
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, onComplete, teslaQuoteShown]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSkip = () => {
    if (skipPhase) {
      skipPhase();
    } else {
      onComplete();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-purple-950/30 border border-purple-600/30 p-6 backdrop-blur-sm rounded-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                rotate: isPlaying ? [0, 360] : 0,
                scale: isPlaying ? [1, 1.05, 1] : 1
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Triangle className="text-purple-400" size={64} />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Phase 1: Release</h2>
          <p className="text-gray-300 mb-4">
            396Hz Root Chakra frequency dissolves fear, guilt, and ancestral trauma. 
            Ground yourself as the triangle geometry activates your foundation.
          </p>
          
          <div className="flex justify-center mb-6">
            <FrequencyPlayer
              frequencyId="396hz"
              isPlaying={isPlaying}
              onPlayToggle={togglePlayback}
              frequency={396}
              audioUrl={getFrequencyAudioUrl(396)}
            />
          </div>
          
          <div className="space-y-4 mb-6">
            <Progress value={progress} className="h-2 bg-purple-900/30" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(secondsElapsed)}</span>
              <span>{formatTime(PHASE_DURATION)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-400 italic mb-6">
            "The present is theirs; the future, for which I really worked, is mine." — Nikola Tesla
          </p>
          
          <Button 
            onClick={handleSkip}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
          >
            Skip to Phase 2
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TrinityPhase1;
