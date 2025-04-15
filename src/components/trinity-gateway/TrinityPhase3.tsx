import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleDot } from "lucide-react";
import { toast } from "sonner";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";

interface TrinityPhase3Props {
  onComplete: () => void;
}

const TrinityPhase3: React.FC<TrinityPhase3Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [teslaQuoteShown, setTeslaQuoteShown] = useState(false);
  const { currentAudio, playAudio, isPlaying, togglePlayPause } = useGlobalAudioPlayer();
  
  const PHASE_DURATION = 180; // 3 minutes in seconds
  const AUDIO_URL = "/frequencies/963hz-crown.mp3";
  
  const isThisFrequencyPlaying = 
    isPlaying && 
    currentAudio?.source === AUDIO_URL && 
    currentAudio?.customData?.frequency === 963;
  
  const togglePlayback = useCallback(() => {
    if (isThisFrequencyPlaying) {
      togglePlayPause();
    } else {
      playAudio({
        title: "Phase 3: Transcend (963Hz)",
        artist: "Sacred Shifter",
        source: AUDIO_URL,
        customData: {
          frequency: 963,
          chakra: "Crown",
          phaseId: "trinity-phase-3"
        }
      });
    }
    
    if (!isThisFrequencyPlaying) {
      toast.info("Beginning Phase 3: Transcend (963Hz)");
    } else {
      toast.info("Frequency paused");
    }
  }, [isThisFrequencyPlaying, playAudio, togglePlayPause]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isThisFrequencyPlaying) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => {
          const newSeconds = prev + 1;
          setProgress((newSeconds / PHASE_DURATION) * 100);
          
          if (newSeconds === 69 && !teslaQuoteShown) {
            toast.info("\"My brain is only a receiver. In the Universe there is a core from which we obtain knowledge, strength, inspiration.\" — Tesla");
            setTeslaQuoteShown(true);
          }
          
          if (newSeconds >= PHASE_DURATION) {
            if (isThisFrequencyPlaying) {
              togglePlayPause();
            }
            setTimeout(() => onComplete(), 1000);
            toast.success("Phase 3 complete: Crown chakra transcended");
            return PHASE_DURATION;
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isThisFrequencyPlaying, onComplete, teslaQuoteShown, togglePlayPause]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-violet-950/30 border border-violet-600/30 p-6 backdrop-blur-sm rounded-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                rotate: isThisFrequencyPlaying ? [0, 360] : 0,
                scale: isThisFrequencyPlaying ? [1, 1.15, 0.95, 1.05, 1] : 1
              }}
              transition={{
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
            >
              <CircleDot className="text-violet-400" size={64} />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Phase 3: Transcend</h2>
          <p className="text-gray-300 mb-4">
            963Hz Crown Chakra frequency opens the gateway to higher consciousness.
            The spiral geometry connects you to source and universal wisdom.
          </p>
          
          <div className="flex justify-center mb-6">
            <SacredAudioPlayer
              audioUrl={AUDIO_URL}
              isPlaying={isThisFrequencyPlaying}
              onPlayToggle={togglePlayback}
              frequency={963}
            />
          </div>
          
          <div className="space-y-4 mb-6">
            <Progress value={progress} className="h-2 bg-violet-900/30" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(secondsElapsed)}</span>
              <span>{formatTime(PHASE_DURATION)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 mb-4">
            As the 963Hz frequency resonates through your crown chakra, 
            feel the boundaries between your consciousness and the universe dissolve.
            You are completing the 3-6-9 sacred sequence, returning to the oneness that you are.
          </p>
          
          <p className="text-gray-400 italic mb-6">
            "The gift of mental power comes from God, Divine Being, and if we concentrate our minds on that truth, 
            we become in tune with this great power." — Nikola Tesla
          </p>
          
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            Complete Trinity Journey
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TrinityPhase3;
