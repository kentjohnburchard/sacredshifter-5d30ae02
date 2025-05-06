
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDailyPractice } from '@/hooks/useDailyPractice';
import DailyPracticeFlow from './DailyPracticeFlow';
import { Sun, Check } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

interface DailyPracticeButtonProps {
  className?: string;
}

const DailyPracticeButton: React.FC<DailyPracticeButtonProps> = ({ className }) => {
  const { 
    isCompleted, 
    isOpen, 
    openPractice, 
    closePractice, 
    handlePracticeComplete,
    completionDate
  } = useDailyPractice();

  const formattedDate = completionDate ? 
    format(parseISO(completionDate), 'MMM d, yyyy') : '';
  
  const completedToday = completionDate && isToday(parseISO(completionDate));

  return (
    <>
      {completedToday ? (
        <div className={`flex items-center gap-2 p-2 rounded-md bg-green-500/20 text-green-300 ${className}`}>
          <Check className="h-5 w-5" />
          <span className="text-sm">Daily Resonance Unlocked</span>
        </div>
      ) : (
        <Button 
          onClick={openPractice} 
          className={`bg-gradient-to-r from-amber-500/80 to-pink-500/80 hover:from-amber-500/90 hover:to-pink-500/90 text-white ${className}`}
          size="sm"
        >
          <Sun className="mr-2 h-4 w-4" />
          Begin Daily Practice
        </Button>
      )}
      
      <DailyPracticeFlow 
        isOpen={isOpen}
        onOpenChange={open => {
          if (!open) closePractice();
        }}
        onComplete={handlePracticeComplete}
      />
    </>
  );
};

export default DailyPracticeButton;
