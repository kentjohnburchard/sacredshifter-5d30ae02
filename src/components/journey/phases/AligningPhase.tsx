
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import ReactMarkdown from 'react-markdown';
import { archetypes, getArchetypeForChakra } from '@/utils/archetypes';
import { Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  const archetype = getArchetypeForChakra(chakra);
  
  // Parse script for affirmations
  useEffect(() => {
    if (!script) {
      setAffirmations(["I am aligned with my highest truth.", "I open myself to healing energy."]);
      return;
    }
    
    const extractedAffirmations: string[] = [];
    
    // Extract content under "## Affirmations" or similar headers
    const affirmationSection = script.match(/## Affirm(ation|ations)?\s+([\s\S]*?)(?=##|$)/i);
    
    if (affirmationSection && affirmationSection[2]) {
      // Split by lines, filter empty ones, and clean up
      const lines = affirmationSection[2].split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      
      // Check if lines start with * or - bullets
      const bulletPattern = /^[*\-]\s+(.+)$/;
      
      lines.forEach(line => {
        const bulletMatch = line.match(bulletPattern);
        if (bulletMatch) {
          extractedAffirmations.push(bulletMatch[1]);
        } else if (line) {
          extractedAffirmations.push(line);
        }
      });
    }
    
    // If no affirmations found, use generic ones based on chakra
    if (extractedAffirmations.length === 0) {
      if (chakra === 'Root') {
        extractedAffirmations.push("I am safe and secure in my body.");
        extractedAffirmations.push("I am grounded and connected to Earth.");
      } else if (chakra === 'Sacral') {
        extractedAffirmations.push("I embrace my creativity and passion.");
        extractedAffirmations.push("I allow pleasure and joy to flow through me.");
      } else if (chakra === 'Solar Plexus') {
        extractedAffirmations.push("I claim my personal power with confidence.");
        extractedAffirmations.push("I trust my inner wisdom and strength.");
      } else if (chakra === 'Heart') {
        extractedAffirmations.push("I am open to giving and receiving love fully.");
        extractedAffirmations.push("I am compassionate with myself and others.");
      } else if (chakra === 'Throat') {
        extractedAffirmations.push("I express my truth with clarity and confidence.");
        extractedAffirmations.push("My voice matters and deserves to be heard.");
      } else if (chakra === 'Third Eye') {
        extractedAffirmations.push("I trust my intuition and inner vision.");
        extractedAffirmations.push("I am connected to my highest wisdom.");
      } else if (chakra === 'Crown') {
        extractedAffirmations.push("I am connected to divine consciousness.");
        extractedAffirmations.push("I am one with the universe and all that is.");
      } else {
        extractedAffirmations.push("I am aligned with my highest truth.");
        extractedAffirmations.push("I open myself to healing energy.");
      }
    }
    
    setAffirmations(extractedAffirmations);
  }, [script, chakra]);
  
  // Initialize audio
  useEffect(() => {
    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.loop = true;
      setAudioElement(audio);
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
    return undefined;
  }, [audioFile]);
  
  // Manage audio playback
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
        });
      } else {
        audioElement.pause();
      }
    }
    
    return () => {
      if (audioElement && isPlaying) {
        audioElement.pause();
      }
    };
  }, [isPlaying, audioElement]);
  
  // Cycle through affirmations
  useEffect(() => {
    if (isPlaying && affirmations.length > 0) {
      const interval = setInterval(() => {
        setCurrentAffirmation(prev => (prev + 1) % affirmations.length);
      }, 8000); // Change affirmation every 8 seconds
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPlaying, affirmations.length]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const skipToNext = () => {
    if (affirmations.length > 0) {
      setCurrentAffirmation(prev => (prev + 1) % affirmations.length);
    }
  };
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Aligning Phase</h2>
        
        {archetype && (
          <p className="text-white/70 mb-2">
            Connecting with the {archetype.name} archetype
          </p>
        )}
        
        {frequency && (
          <p className="text-white/60 text-sm mb-6">
            Frequency: {frequency}Hz
          </p>
        )}
      </motion.div>
      
      {/* Audio controls */}
      <div className="mb-10 flex items-center justify-center gap-4">
        <Button
          onClick={togglePlay}
          className="rounded-full w-12 h-12 flex items-center justify-center"
          style={{ backgroundColor: chakraColor }}
          variant="secondary"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-black" />
          ) : (
            <Play className="h-5 w-5 ml-1 text-black" />
          )}
        </Button>
        
        {isPlaying && (
          <motion.div 
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/70 text-sm">
              {audioFile ? "Playing frequency" : "Visualization active"}
            </p>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-3 rounded-full"
                  style={{ backgroundColor: chakraColor }}
                  animate={{
                    height: [3, 12, 5, 9, 3],
                    opacity: [0.5, 1, 0.8, 0.6, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        <Button
          onClick={skipToNext}
          variant="ghost"
          className="rounded-full w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Affirmation display */}
      <div className="w-full max-w-lg mx-auto mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAffirmation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 rounded-lg"
            style={{ 
              backgroundColor: `${chakraColor}15`,
              border: `1px solid ${chakraColor}40`,
              boxShadow: `0 0 20px ${chakraColor}30`
            }}
          >
            {affirmations.length > 0 && (
              <p className="text-xl sm:text-2xl font-medium text-white">
                "{affirmations[currentAffirmation]}"
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="w-full max-w-md flex justify-end px-4">
        <Button
          onClick={onComplete}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Continue to Activation
        </Button>
      </div>
    </div>
  );
};

export default AligningPhase;
