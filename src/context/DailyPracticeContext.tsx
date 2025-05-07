
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DailyPractice } from '@/types/daily-practice';

interface DailyPracticeContextType {
  dailyPractice: DailyPractice | null;
  currentStep: number;
  completeStep: () => void;
  resetDailyPractice: () => void;
  isLoading: boolean;
  error: string | null;
}

const DailyPracticeContext = createContext<DailyPracticeContextType | undefined>(undefined);

export const useDailyPractice = () => {
  const context = useContext(DailyPracticeContext);
  if (!context) {
    throw new Error('useDailyPractice must be used within a DailyPracticeProvider');
  }
  return context;
};

export const DailyPracticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dailyPractice, setDailyPractice] = useState<DailyPractice | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setDailyPractice({
        title: 'Sacred Daily Practice',
        steps: [
          { title: 'Grounding', description: 'Breathe deeply and connect to Earth.' },
          { title: 'Alignment', description: 'Focus on chakras and bring them into harmony.' },
          { title: 'Activation', description: 'Set your intention and energize your field.' }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const completeStep = () => {
    if (!dailyPractice) return;
    setCurrentStep((prev) => Math.min(prev + 1, dailyPractice.steps.length - 1));
  };

  const resetDailyPractice = () => {
    setCurrentStep(0);
  };

  return (
    <DailyPracticeContext.Provider
      value={{
        dailyPractice,
        currentStep,
        completeStep,
        resetDailyPractice,
        isLoading,
        error
      }}
    >
      {children}
    </DailyPracticeContext.Provider>
  );
};
