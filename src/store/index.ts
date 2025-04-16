
import { create } from 'zustand';

interface AppState {
  // Audio state
  isPlaying: boolean;
  currentFrequency: number | null;
  detectedPrimes: number[];
  audioPlaybackError: string | null;
  audioInitialized: boolean;
  
  // UI state
  sidebarOpen: boolean;
  activeTheme: string;
  
  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentFrequency: (frequency: number | null) => void;
  setDetectedPrimes: (primes: number[]) => void;
  setAudioPlaybackError: (error: string | null) => void;
  setAudioInitialized: (initialized: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTheme: (theme: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial audio state
  isPlaying: false,
  currentFrequency: null,
  detectedPrimes: [],
  audioPlaybackError: null,
  audioInitialized: false,
  
  // Initial UI state
  sidebarOpen: false,
  activeTheme: 'dark',
  
  // Actions
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentFrequency: (currentFrequency) => set({ currentFrequency }),
  setDetectedPrimes: (detectedPrimes) => set({ detectedPrimes }),
  setAudioPlaybackError: (audioPlaybackError) => set({ audioPlaybackError }),
  setAudioInitialized: (audioInitialized) => set({ audioInitialized }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveTheme: (activeTheme) => set({ activeTheme }),
}));
