
import { create } from 'zustand';

interface AppState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentSongId: string | null;
  setCurrentSongId: (id: string | null) => void;
  audioData: Uint8Array | null;
  setAudioData: (audioData: Uint8Array | null) => void;
  frequencyData: Uint8Array | null;
  setFrequencyData: (frequencyData: Uint8Array | null) => void;
  primeSequence: number[];
  setPrimeSequence: (sequence: number[]) => void;
  visualizationMode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower';
  setVisualizationMode: (mode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower') => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  currentSongId: null,
  setCurrentSongId: (id: string | null) => set({ currentSongId: id }),
  audioData: null,
  setAudioData: (audioData: Uint8Array | null) => set({ audioData }),
  frequencyData: null,
  setFrequencyData: (frequencyData: Uint8Array | null) => set({ frequencyData }),
  primeSequence: [],
  setPrimeSequence: (sequence: number[]) => set({ primeSequence: sequence }),
  visualizationMode: 'sacred',
  setVisualizationMode: (mode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower') => set({ visualizationMode: mode }),
}));
