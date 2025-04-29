
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  guide: string;
  preparation: string[];
  frequencies: string[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface PremiumContextType {
  experiences: Experience[];
  loading: boolean;
  getExperienceById: (id: string) => Experience | undefined;
  saveProgress: (experienceId: string, progress: number) => void;
  favoriteExperience: (experienceId: string) => void;
}

// Create context
const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

// Sample data
const sampleExperiences: Experience[] = [
  {
    id: 'exp1',
    title: 'Cosmic Gateway Meditation',
    description: 'Open your consciousness to higher dimensions through this guided journey of sacred sounds and visualizations.',
    imageUrl: '/placeholder.svg',
    guide: 'This sacred journey combines ancient wisdom with quantum frequencies to align your consciousness with the higher dimensions. Allow yourself to be fully present as the journey unfolds.',
    preparation: [
      'Find a quiet space where you won\'t be disturbed',
      'Light a candle or incense if available',
      'Set a clear intention before beginning',
      'Have water nearby for after the experience'
    ],
    frequencies: ['432', '528', '963'],
    duration: 20,
    level: 'intermediate'
  },
  {
    id: 'exp2',
    title: 'Chakra Alignment Ritual',
    description: 'Balance and harmonize your energy centers with this premium sacred energy activation.',
    imageUrl: '/placeholder.svg',
    guide: 'This chakra ritual will guide you through each energy center, using specific frequencies and visualizations to clear blockages and enhance flow.',
    preparation: [
      'Wear comfortable clothing',
      'Position yourself where your spine can be straight',
      'Remove any electronic devices nearby',
      'Bring a crystal if you have one'
    ],
    frequencies: ['396', '417', '741', '852'],
    duration: 30,
    level: 'beginner'
  },
  {
    id: 'exp3',
    title: 'Sacred Geometry Activation',
    description: 'Connect with the divine blueprint through sacred geometric patterns and frequency attunement.',
    imageUrl: '/placeholder.svg',
    guide: 'Sacred geometry forms the foundation of all creation. This journey will help you internalize these patterns to bring harmony to your energy field.',
    preparation: [
      'Create a sacred space free from distractions',
      'Have a journal nearby to record insights',
      'Drink water before beginning',
      'Set a clear intention for geometric alignment'
    ],
    frequencies: ['639', '852', '1134'],
    duration: 25,
    level: 'advanced'
  },
  {
    id: 'exp4',
    title: 'Divine Light Transmission',
    description: 'Receive higher frequency light codes to accelerate your spiritual evolution and consciousness expansion.',
    imageUrl: '/placeholder.svg',
    guide: 'This sacred transmission works directly with your higher self to download light codes that support your evolution. Remain open and receptive throughout.',
    preparation: [
      'Meditate for at least 5 minutes before beginning',
      'Set sacred intentions for your growth',
      'Have a notepad ready for post-journey insights',
      'Create a comfortable space where you can lie down'
    ],
    frequencies: ['777', '888', '999'],
    duration: 40,
    level: 'advanced'
  }
];

// Provider component
export const PremiumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [experiences, setExperiences] = useState<Experience[]>(sampleExperiences);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const getExperienceById = useCallback((id: string) => {
    return experiences.find(exp => exp.id === id);
  }, [experiences]);

  const saveProgress = useCallback((experienceId: string, progressValue: number) => {
    setProgress(prev => ({ ...prev, [experienceId]: progressValue }));
  }, []);

  const favoriteExperience = useCallback((experienceId: string) => {
    setFavorites(prev => {
      if (prev.includes(experienceId)) {
        return prev.filter(id => id !== experienceId);
      } else {
        return [...prev, experienceId];
      }
    });
  }, []);

  const value = {
    experiences,
    loading,
    getExperienceById,
    saveProgress,
    favoriteExperience
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};

// Custom hook
export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
