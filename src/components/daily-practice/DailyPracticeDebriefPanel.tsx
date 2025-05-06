
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createTimelineEntry } from '@/services/timelineService';
import { ChakraTag } from '@/types/chakras';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface DailyPracticeDebriefPanelProps {
  chakraTag: ChakraTag;
  userId?: string;
  journeyId?: string;
  onComplete: () => void;
  onSkip: () => void;
}

const DailyPracticeDebriefPanel: React.FC<DailyPracticeDebriefPanelProps> = ({
  chakraTag,
  userId,
  journeyId,
  onComplete,
  onSkip,
}) => {
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { audioRef, setAudioSource } = useAudioPlayer();
  
  // Play a soft closing tone
  React.useEffect(() => {
    setAudioSource('/lovable-uploads/closing_tone_963.mp3');
    
    // Fade out the audio after a few seconds
    const fadeOutTimer = setTimeout(() => {
      if (audioRef.current) {
        const fadeInterval = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.1) {
            audioRef.current.volume -= 0.1;
          } else {
            clearInterval(fadeInterval);
            if (audioRef.current) audioRef.current.pause();
          }
        }, 200);
      }
    }, 5000);
    
    return () => {
      clearTimeout(fadeOutTimer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [setAudioSource, audioRef]);

  const handleSaveReflection = async () => {
    if (!userId || !reflection.trim()) return;
    
    setIsSaving(true);
    
    try {
      // Format the notes data
      const notesData = {
        type: 'DailyPractice',
        content: reflection.trim()
      };
      
      await createTimelineEntry(
        userId,
        'Daily Practice Reflection',
        'daily_reflection',
        notesData,
        chakraTag,
        journeyId
      );
      
      toast.success("Reflection Saved", {
        description: "Your reflection has been added to your timeline."
      });
      
      // Complete the process
      onComplete();
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error("Couldn't save reflection", {
        description: "Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center p-6 pb-8"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <motion.div 
            className="inline-block mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Heart size={40} className="text-pink-400 mx-auto opacity-70" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Daily Resonance Complete</h2>
          <p className="text-white/80 mb-6">Your light has aligned. What came up for you?</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write what you felt, saw, or released…"
              className="min-h-[120px] border border-purple-500/30 bg-black/50 text-white placeholder:text-white/50 focus:border-purple-500/60 transition-all duration-300 resize-none"
            />
            <motion.div 
              className="absolute inset-0 pointer-events-none border rounded-md"
              animate={{
                boxShadow: ['0 0 0 rgba(155,135,245,0)', '0 0 8px rgba(155,135,245,0.3)', '0 0 0 rgba(155,135,245,0)']
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            />
          </div>
          
          <div className="flex gap-3 justify-center pt-2">
            <Button
              variant="outline"
              onClick={onSkip}
              className="border-white/30 hover:bg-white/10 text-white/70"
            >
              Skip for Now
            </Button>
            
            <Button
              onClick={handleSaveReflection}
              disabled={isSaving || !reflection.trim()}
              className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500/90 hover:to-pink-500/90 text-white"
            >
              {isSaving ? "Saving..." : "Save Reflection"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyPracticeDebriefPanel;
