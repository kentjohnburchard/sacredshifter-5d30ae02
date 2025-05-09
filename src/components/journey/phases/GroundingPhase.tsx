
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { Button } from '@/components/ui/button';
import { Sparkles, Pause, Play } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface GroundingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  intent?: string;
  frequency?: number;
}

const GroundingPhase: React.FC<GroundingPhaseProps> = ({
  onComplete,
  chakra,
  intent,
  frequency
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(60); // 1 minute grounding
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { isPlaying, togglePlayPause } = useGlobalAudioPlayer();
  
  // Start timer automatically after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Run countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && !showButton) {
      setShowButton(true);
      toast.success("You are now grounded. Continue when ready.", {
        duration: 5000
      });
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, showButton]);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-black/30 backdrop-blur-md rounded-xl border border-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Begin Your Journey</h2>
          <p className="text-white/75">
            Take a deep breath and set your intention for this sacred experience
          </p>
        </div>
        
        <div className="my-8 relative">
          <div className="flex justify-center items-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="p-8 rounded-full"
              style={{
                background: `radial-gradient(circle, ${getChakraColor(chakra)}40 0%, rgba(0,0,0,0) 70%)`,
                boxShadow: `0 0 40px ${getChakraColor(chakra)}30`
              }}
            >
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Sparkles 
                  size={64}
                  color={getChakraColor(chakra) || "#FFFFFF"}
                  strokeWidth={1.5}
                />
              </motion.div>
            </motion.div>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-xl text-white mb-3">
              {intent || "Centre your energy and connect with your higher self"}
            </p>
            {frequency && (
              <p className="text-white/60 text-sm">
                Frequency: {frequency}Hz
              </p>
            )}
          </div>
          
          <div className="flex justify-center mb-4">
            <button
              onClick={togglePlayPause}
              className="flex items-center px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 rounded-full text-white border border-purple-700/50 transition-colors"
            >
              {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
              {isPlaying ? "Pause Audio" : "Resume Audio"}
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium"
              style={{
                background: `conic-gradient(${getChakraColor(chakra) || '#8B5CF6'} ${(secondsRemaining / 60) * 100}%, transparent 0%)`,
                boxShadow: `0 0 15px ${getChakraColor(chakra)}30`
              }}
            >
              <div className="bg-black w-20 h-20 rounded-full flex items-center justify-center text-white">
                {secondsRemaining}
              </div>
            </div>
            <p className="mt-4 text-white/70 text-sm">
              {isTimerRunning ? "Breathe deeply..." : "Preparing..."}
            </p>
          </div>

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: showButton ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={onComplete}
              disabled={!showButton}
              className="px-8 py-6 text-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-900/30"
            >
              Continue Your Journey
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroundingPhase;
