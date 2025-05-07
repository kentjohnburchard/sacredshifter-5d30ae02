
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDailyPractice } from '@/context/DailyPracticeContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DailyPracticeFlow from './DailyPracticeFlow';
import { Sun, Check } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

interface DailyPracticeButtonProps {
  className?: string;
}

const DailyPracticeButton: React.FC<DailyPracticeButtonProps> = ({ className }) => {
  const { dailyPractice, currentStep, completeStep } = useDailyPractice();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock completion tracking for now
  const completionDate = localStorage.getItem('daily-practice-date');
  const completedToday = completionDate && isToday(parseISO(completionDate));
  
  const openPractice = () => setIsOpen(true);
  const closePractice = () => setIsOpen(false);
  
  const handleComplete = () => {
    localStorage.setItem('daily-practice-date', new Date().toISOString().split('T')[0]);
    closePractice();
  };

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
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DailyPracticeFlow />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyPracticeButton;
