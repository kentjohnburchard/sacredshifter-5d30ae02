
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export function useDailyPractice() {
  const { user } = useAuth();
  const [dailyPracticeDate, setDailyPracticeDate] = useLocalStorage<string>('daily-practice-date', '');
  const [shouldShowPractice, setShouldShowPractice] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if today's practice has been completed
  const isTodayCompleted = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return dailyPracticeDate === today;
  };

  // Check if we should auto-show the practice
  useEffect(() => {
    // Only show if user is logged in
    if (!user) return;
    
    // Check if practice already completed today
    if (isTodayCompleted()) {
      setShouldShowPractice(false);
      return;
    }

    // Set flag to show practice
    setShouldShowPractice(true);
  }, [user, dailyPracticeDate]);

  // Open the practice flow
  const openPractice = () => {
    setIsOpen(true);
  };

  // Handle practice completion
  const handlePracticeComplete = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setDailyPracticeDate(today);
    setShouldShowPractice(false);
    setIsOpen(false);
  };

  return {
    isCompleted: isTodayCompleted(),
    shouldShowPractice,
    isOpen,
    openPractice,
    closePractice: () => setIsOpen(false),
    handlePracticeComplete,
    completionDate: dailyPracticeDate
  };
}
