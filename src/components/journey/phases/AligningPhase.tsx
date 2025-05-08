
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraTag } from '@/types/chakras';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Volume, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
  const { playAudio, isPlaying, togglePlayPause } = useGlobalAudioPlayer();
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  
  // Extract affirmations from script
  useEffect(() => {
    if (script) {
      // Simple extraction of affirmations from markdown script
      // This regex looks for lines that might be affirmations - starts with "I", "You", "We" or quotes
      const extractedAffirmations = script.split('\n')
        .filter(line => line.trim().match(/^[">]*\s*["']*(I|You|We|My|Your|Our)/i))
        .map(line => line.trim().replace(/^[">]*\s*|["']*/g, ''));
      
      // If no affirmations found, create default ones based on chakra
      if (extractedAffirmations.length === 0 && chakra) {
        switch (chakra) {
          case 'Root':
            setAffirmations(["I am safe and secure", "I am grounded and centered", "I trust in the process of life"]);
            break;
          case 'Sacral':
            setAffirmations(["I embrace my creativity", "I honor my feelings", "I allow pleasure in my life"]);
            break;
          case 'Solar Plexus':
            setAffirmations(["I am confident and powerful", "I trust my decisions", "I am worthy of respect"]);
            break;
          case 'Heart':
            setAffirmations(["I am love", "I give and receive love freely", "My heart is open and healed"]);
            break;
          case 'Throat':
            setAffirmations(["I speak my truth with clarity", "My voice matters", "I express myself authentically"]);
            break;
          case 'Third Eye':
            setAffirmations(["I trust my intuition", "I see clearly", "My perception is expanding"]);
            break;
          case 'Crown':
            setAffirmations(["I am connected to divine wisdom", "I am one with the universe", "I am a being of light"]);
            break;
          default:
            setAffirmations(["I am present in this moment", "I am aligned with my highest self", "I am awakening to my full potential"]);
        }
      } else {
        setAffirmations(extractedAffirmations);
      }
    } else {
      setAffirmations(["I am present", "I am aligned", "I am awakening"]);
    }
  }, [script, chakra]);

  // Start playing audio when component mounts
  useEffect(() => {
    if (audioFile) {
      playAudio({
        source: audioFile,
        title: `${chakra || 'Sacred'} Frequency`,
        frequency: frequency || undefined
      });
    }
    
    // Auto-advance through affirmations
    const progressInterval = setInterval(() => {
      setPhaseProgress(prev => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [playAudio, audioFile, chakra, frequency, onComplete]);
  
  // Auto-advance affirmations
  useEffect(() => {
    if (!autoAdvanceEnabled || affirmations.length === 0) return;
    
    const affirmationInterval = setInterval(() => {
      setCurrentAffirmationIndex(prev => (prev + 1) % affirmations.length);
    }, 7000); // Change affirmation every 7 seconds
    
    return () => clearInterval(affirmationInterval);
  }, [autoAdvanceEnabled, affirmations.length]);

  // Get spiral parameters based on chakra
  const getSpiralParams = () => {
    const baseParams = {
      coeffA: 1.2,
      coeffB: 0.8,
      freqA: 3.2,
      freqB: 4.1,
      color: '255,255,255',
      opacity: 70,
      strokeWeight: 1.0,
      maxCycles: 5,
      speed: 0.3
    };
    
    if (chakra) {
      // Adjust color based on chakra
      switch (chakra) {
        case 'Root':
          baseParams.color = '255,0,0';
          baseParams.freqA = 4.0;
          break;
        case 'Sacral':
          baseParams.color = '255,127,0';
          baseParams.freqA = 4.2;
          break;
        case 'Solar Plexus':
          baseParams.color = '255,255,0';
          baseParams.freqA = 5.3;
          break;
        case 'Heart':
          baseParams.color = '0,255,0';
          baseParams.freqA = 6.4;
          break;
        case 'Throat':
          baseParams.color = '0,255,255';
          baseParams.freqA = 7.4;
          break;
        case 'Third Eye':
          baseParams.color = '0,0,255';
          baseParams.freqA = 8.5;
          break;
        case 'Crown':
          baseParams.color = '139,0,255';
          baseParams.freqA = 9.6;
          break;
        default:
          baseParams.color = '255,255,255';
      }
    }
    
    // If we have a frequency, adjust parameters based on it
    if (frequency) {
      baseParams.freqB = frequency / 100;
      baseParams.coeffA = frequency / 500;
    }
    
    return baseParams;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh]">
      {/* Background spiral */}
      <div className="absolute inset-0 z-0">
        <SpiralVisualizer 
          params={getSpiralParams()}
          containerId="aligning-spiral"
        />
      </div>
      
      <div className="relative z-10 max-w-lg mx-auto text-center p-6">
        {/* Affirmations */}
        <AnimatePresence mode="wait">
          {affirmations.length > 0 && (
            <motion.div
              key={currentAffirmationIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="min-h-[120px] flex items-center justify-center"
            >
              <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg">
                <h3 className="text-2xl font-light mb-2 text-white">
                  {affirmations[currentAffirmationIndex]}
                </h3>
                
                {frequency && (
                  <p className="text-white/60 text-sm mt-4">
                    {frequency}Hz • {chakra || 'Sacred'} Frequency
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Audio control */}
        <div className="mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="rounded-full h-10 w-10 bg-black/30 border-white/20"
          >
            {isPlaying ? (
              <Volume className="h-4 w-4 text-white" />
            ) : (
              <VolumeX className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full mt-8 bg-white/10 rounded-full h-1">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AligningPhase;
