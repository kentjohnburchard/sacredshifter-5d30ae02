
import React, { useEffect, useState } from 'react';
import { useDailyPractice } from '@/context/DailyPracticeContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DailyPracticeFlow from './DailyPracticeFlow';

const DailyPracticeAutoLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if practice has already been completed today
  const shouldShowPractice = !localStorage.getItem('daily-practice-date')?.includes(new Date().toISOString().split('T')[0]);
  
  // Auto-launch the practice if it hasn't been completed today
  useEffect(() => {
    if (shouldShowPractice) {
      // Add a slight delay to allow the page to load fully
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowPractice]);

  const handleComplete = () => {
    localStorage.setItem('daily-practice-date', new Date().toISOString().split('T')[0]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DailyPracticeFlow />
      </DialogContent>
    </Dialog>
  );
};

export default DailyPracticeAutoLauncher;
