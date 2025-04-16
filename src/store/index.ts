
import { create } from 'zustand';

interface AppState {
  // Audio state
  isPlaying: boolean;
  currentFrequency: number | null;
  detectedPrimes: number[];
  audioPlaybackError: string | null;
  audioInitialized: boolean;
  audioData: Uint8Array;
  frequencyData: Uint8Array;
  primeSequence: number[];
  
  // Visualization state
  visualizationMode: string;
  
  // UI state
  sidebarOpen: boolean;
  activeTheme: string;
  statusMessage: string | null;
  
  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentFrequency: (frequency: number | null) => void;
  setDetectedPrimes: (primes: number[]) => void;
  setAudioPlaybackError: (error: string | null) => void;
  setAudioInitialized: (initialized: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTheme: (theme: string) => void;
  setAudioData: (data: Uint8Array) => void;
  setFrequencyData: (data: Uint8Array) => void;
  setPrimeSequence: (primes: number[]) => void;
  setVisualizationMode: (mode: string) => void;
  setStatusMessage: (message: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial audio state
  isPlaying: false,
  currentFrequency: null,
  detectedPrimes: [],
  audioPlaybackError: null,
  audioInitialized: false,
  audioData: new Uint8Array(0),
  frequencyData: new Uint8Array(0),
  primeSequence: [],
  
  // Initial visualization state
  visualizationMode: 'sacred',
  
  // Initial UI state
  sidebarOpen: false,
  activeTheme: 'dark',
  statusMessage: null,
  
  // Actions
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentFrequency: (currentFrequency) => set({ currentFrequency }),
  setDetectedPrimes: (detectedPrimes) => set({ detectedPrimes }),
  setAudioPlaybackError: (audioPlaybackError) => set({ audioPlaybackError }),
  setAudioInitialized: (audioInitialized) => set({ audioInitialized }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveTheme: (activeTheme) => set({ activeTheme }),
  setAudioData: (audioData) => set({ audioData }),
  setFrequencyData: (frequencyData) => set({ frequencyData }),
  setPrimeSequence: (primeSequence) => set({ primeSequence }),
  setVisualizationMode: (visualizationMode) => set({ visualizationMode }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
}));
