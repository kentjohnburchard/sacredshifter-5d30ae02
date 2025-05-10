
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { Button } from '@/components/ui/button';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import ReactMarkdown from 'react-markdown';
import { Pause, Play } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import useSpiralParams from '@/hooks/useSpiralParams';

interface AligningPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  frequency?: number;
  audioFile?: string;
  script?: string;
}

const AligningPhase: React.FC<AligningPhaseProps> = ({
  onComplete,
  chakra,
  frequency,
  audioFile,
  script
}) => {
  const { isPlaying, togglePlayPause } = useGlobalAudioPlayer();
  const [readyToProceed, setReadyToProceed] = useState(false);
  const { params, getDefaultParamsForChakra } = useSpiralParams();
  
  // Allow proceeding after a set time
  useEffect(() => {
    const timer = setTimeout(() => {
      setReadyToProceed(true);
    }, 15000); // 15 seconds minimum
    
    return () => clearTimeout(timer);
  }, []);
  
  // Extract the chakra-specific spiral parameters
  const getSpiralParams = () => {
    if (!chakra) return params;
    
    // Get chakra-specific parameters
    const chakraParams = getDefaultParamsForChakra(chakra);
    
    return chakraParams;
  };

  return (
    <div className="relative w-full h-full flex flex-col min-h-[60vh]">
      {/* Background spiral */}
      <div className="absolute inset-0 z-0 opacity-70">
        <SpiralVisualizer params={getSpiralParams()} />
      </div>
      
      <div className="relative z-10 p-4 md:p-6 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Align Your Energy
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
          
          <div className="prose prose-invert max-w-none mb-8">
            {script ? (
              <ReactMarkdown>{script}</ReactMarkdown>
            ) : (
              <div className="text-white/80">
                <p>Focus on your breath as you connect with the sacred frequency of {frequency || "this journey"}.</p>
                <p className="mt-4">Allow the vibrations to resonate through your {chakra || "energy"} chakra, bringing it into perfect alignment with the universe.</p>
                <p className="mt-4">As you breathe, visualize light and energy flowing through your body.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: readyToProceed ? 1 : 0,
                y: readyToProceed ? 0 : 20
              }}
              transition={{ duration: 0.7 }}
            >
              <Button 
                onClick={onComplete}
                className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg shadow-lg"
                disabled={!readyToProceed}
              >
                Continue to Activation
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AligningPhase;
