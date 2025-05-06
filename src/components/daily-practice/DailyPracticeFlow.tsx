
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useJourney } from '@/context/JourneyContext';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { logTimelineEvent } from '@/services/timelineService';
import { ChakraTag } from '@/types/chakras';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import GroundingPhase from './GroundingPhase';
import AligningPhase from './AligningPhase';
import ActivatingPhase from './ActivatingPhase';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DailyPracticeFlowProps {
  onComplete?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PHASES = ['grounding', 'aligning', 'activating', 'complete'] as const;
type PhaseType = typeof PHASES[number];

const DailyPracticeFlow: React.FC<DailyPracticeFlowProps> = ({ 
  onComplete, 
  isOpen, 
  onOpenChange 
}) => {
  const { user } = useAuth();
  const { activeJourney, getJourneyChakra } = useJourney();
  const { getDominantChakra, recordActivation } = useChakraActivations();
  
  const [currentPhase, setCurrentPhase] = useState<PhaseType>('grounding');
  const [dominantChakra, setDominantChakra] = useState<ChakraTag>('Heart');
  const [dailyPracticeDate, setDailyPracticeDate] = useLocalStorage<string>('daily-practice-date', '');
  const [skipAnimations, setSkipAnimations] = useState(false);

  // Check if today's practice is completed
  const isTodayCompleted = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return dailyPracticeDate === today;
  };

  // Set dominant chakra based on user data or journey
  useEffect(() => {
    const setUserChakra = async () => {
      // First, try to get chakra from active journey
      const journeyChakra = getJourneyChakra();
      if (journeyChakra) {
        setDominantChakra(journeyChakra);
        return;
      }
      
      // Second, get user's dominant chakra from activity
      const userDominantChakra = getDominantChakra();
      if (userDominantChakra) {
        setDominantChakra(userDominantChakra);
        return;
      }
      
      // Default to Heart if nothing else available
      setDominantChakra('Heart');
    };
    
    setUserChakra();
  }, [getJourneyChakra, getDominantChakra]);

  // Advance to next phase
  const goToNextPhase = () => {
    const currentIndex = PHASES.indexOf(currentPhase);
    if (currentIndex < PHASES.length - 1) {
      setCurrentPhase(PHASES[currentIndex + 1]);
    } else {
      handleComplete();
    }
  };

  // Handle skip functionality for accessibility
  const handleSkip = () => {
    setSkipAnimations(true);
    setCurrentPhase('complete');
    handleComplete();
  };

  // Complete the daily practice
  const handleComplete = async () => {
    if (!user) return;
    
    // Record completion date
    const today = format(new Date(), 'yyyy-MM-dd');
    setDailyPracticeDate(today);
    
    // Log to timeline
    await logTimelineEvent(
      user.id,
      'daily_practice',
      'completed',
      activeJourney?.id?.toString(),
      { 
        chakra: dominantChakra,
        date: today
      }
    );
    
    // Record chakra activation
    await recordActivation(dominantChakra, 'daily_practice', activeJourney?.id?.toString());
    
    // Show completion message
    toast.success("Daily Resonance Unlocked", {
      description: "Your practice has been recorded in your timeline.",
    });
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
    
    // Close dialog if needed
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open && currentPhase !== 'complete') {
      // Prompt before closing if not completed
      if (confirm('Are you sure you want to exit your daily practice?')) {
        onOpenChange(false);
      } else {
        onOpenChange(true);
      }
    } else {
      onOpenChange(open);
    }
  };

  // Render the current phase
  const renderPhase = () => {
    switch(currentPhase) {
      case 'grounding':
        return <GroundingPhase 
          onComplete={goToNextPhase} 
          skipAnimations={skipAnimations}
        />;
      
      case 'aligning':
        return <AligningPhase 
          chakraTag={dominantChakra} 
          onComplete={goToNextPhase}
          skipAnimations={skipAnimations}
        />;
        
      case 'activating':
        return <ActivatingPhase 
          onComplete={goToNextPhase}
          skipAnimations={skipAnimations}
        />;
        
      case 'complete':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Practice Complete</h2>
            <p className="text-lg mb-6">
              Carry this resonance into your journey.
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Continue Your Journey
            </Button>
          </div>
        );
    }
  };

  // Determine dialog width based on phase
  const getDialogWidth = () => {
    if (currentPhase === 'complete') return 'sm:max-w-md';
    return 'sm:max-w-2xl';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent 
        className={`bg-black/80 border-purple-500/30 backdrop-blur-md ${getDialogWidth()}`}
        showClose={false}
      >
        {/* Skip button for accessibility */}
        {currentPhase !== 'complete' && (
          <div className="absolute right-4 top-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs opacity-50 hover:opacity-100 border-white/20" 
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-xs opacity-50 hover:opacity-100" 
              onClick={() => onOpenChange(false)}
            >
              <X size={16} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}
        
        {/* Progress indicator */}
        {currentPhase !== 'complete' && (
          <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 p-2">
            {PHASES.slice(0, -1).map((phase, i) => (
              <div 
                key={phase}
                className={`h-1 w-16 rounded-full transition-colors ${
                  PHASES.indexOf(currentPhase) >= i 
                    ? 'bg-purple-500' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Phase content */}
        <div className="mt-4">
          {renderPhase()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyPracticeFlow;
