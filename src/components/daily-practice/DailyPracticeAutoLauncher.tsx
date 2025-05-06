
import React, { useEffect } from 'react';
import { useDailyPractice } from '@/hooks/useDailyPractice';
import DailyPracticeFlow from './DailyPracticeFlow';

const DailyPracticeAutoLauncher: React.FC = () => {
  const { 
    shouldShowPractice, 
    isOpen, 
    openPractice, 
    closePractice, 
    handlePracticeComplete
  } = useDailyPractice();
  
  // Auto-launch the practice if it hasn't been completed today
  useEffect(() => {
    if (shouldShowPractice) {
      // Add a slight delay to allow the page to load fully
      const timer = setTimeout(() => {
        openPractice();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowPractice, openPractice]);

  return (
    <DailyPracticeFlow 
      isOpen={isOpen}
      onOpenChange={open => {
        if (!open) closePractice();
      }}
      onComplete={handlePracticeComplete}
    />
  );
};

export default DailyPracticeAutoLauncher;
