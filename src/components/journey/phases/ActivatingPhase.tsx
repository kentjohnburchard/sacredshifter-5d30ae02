
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Pause, Play, ZapOff } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { toast } from 'sonner';

interface ActivatingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  frequency?: number;
  script?: string;
}

const ActivatingPhase: React.FC<ActivatingPhaseProps> = ({
  onComplete,
  chakra,
  frequency,
  script
}) => {
  const { isPlaying, togglePlayPause } = useGlobalAudioPlayer();
  const [energyLevel, setEnergyLevel] = useState(0);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [activationTriggered, setActivationTriggered] = useState(false);
  
  // Increase energy level over time
  useEffect(() => {
    if (energyLevel < 100 && !activationTriggered) {
      const timer = setTimeout(() => {
        setEnergyLevel(prev => {
          const newLevel = prev + 1;
          if (newLevel === 100) {
            setReadyToProceed(true);
            toast.success("Activation complete! You may proceed when ready.");
          }
          return newLevel;
        });
      }, 300); // Fill in about 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [energyLevel, activationTriggered]);
  
  const triggerActivation = () => {
    setActivationTriggered(true);
    
    // Visual effect, then allow proceeding
    toast.info(`${chakra || 'Energy'} activation in progress...`);
    
    // Quick fill the energy bar
    const fillInterval = setInterval(() => {
      setEnergyLevel(prev => {
        const newLevel = prev + 5;
        if (newLevel >= 100) {
          clearInterval(fillInterval);
          setReadyToProceed(true);
          toast.success("Activation complete!");
          return 100;
        }
        return newLevel;
      });
    }, 100);
    
    return () => clearInterval(fillInterval);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black/40 backdrop-blur-md rounded-lg border border-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Activate Your {chakra || "Energy"} Center
        </h2>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={togglePlayPause}
            className="flex items-center px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 rounded-full text-white border border-purple-700/50 transition-colors"
          >
            {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
            {isPlaying ? "Pause Audio" : "Resume Audio"}
          </button>
        </div>
        
        <div className="mb-8 prose prose-invert max-w-none">
          {script ? (
            <ReactMarkdown>{script}</ReactMarkdown>
          ) : (
            <div className="text-white/80">
              <p>As the frequency resonates through your being, allow your {chakra || "energy"} center to fully activate.</p>
              <p className="mt-4">Feel the energy building and expanding as you connect with the {frequency || "sacred"} Hz frequency.</p>
              <p className="mt-4">Your consciousness is expanding, allowing you to access deeper wisdom and clarity.</p>
            </div>
          )}
        </div>
        
        <div className="my-8">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-white/80 text-sm">Activation Progress</span>
            <span className="text-white font-medium">{energyLevel}%</span>
          </div>
          <div className="w-full h-4 bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                backgroundColor: getChakraColor(chakra) || '#8B5CF6',
                width: `${energyLevel}%` 
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${energyLevel}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {!activationTriggered && energyLevel < 100 && (
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={triggerActivation}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ZapOff className="mr-2 h-4 w-4" />
                Accelerate Activation
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: readyToProceed ? 1 : 0,
            }}
            transition={{ duration: 0.7 }}
          >
            <Button 
              onClick={onComplete}
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium text-lg shadow-lg"
              disabled={!readyToProceed}
            >
              Continue to Integration
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivatingPhase;
