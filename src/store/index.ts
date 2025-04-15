
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
  detectedPrimes: number[];
  setDetectedPrimes: (primes: number[]) => void;
  visualizationMode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower' | 'pixel';
  setVisualizationMode: (mode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower' | 'pixel') => void;
  audioPlaybackError: string | null;
  setAudioPlaybackError: (error: string | null) => void;
  lastAudioEvent: string | null;
  setLastAudioEvent: (event: string | null) => void;
  visualizationQuality: 'low' | 'medium' | 'high';
  setVisualizationQuality: (quality: 'low' | 'medium' | 'high') => void;
  visualizationColors: string[];
  setVisualizationColors: (colors: string[]) => void;
  audioContext: AudioContext | null;
  setAudioContext: (context: AudioContext | null) => void;
  audioInitialized: boolean;
  setAudioInitialized: (initialized: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => {
    console.log("Setting global isPlaying state:", isPlaying);
    set({ isPlaying });
  },
  currentSongId: null,
  setCurrentSongId: (id: string | null) => set({ currentSongId: id }),
  audioData: null,
  setAudioData: (audioData: Uint8Array | null) => set({ audioData }),
  frequencyData: null,
  setFrequencyData: (frequencyData: Uint8Array | null) => set({ frequencyData }),
  primeSequence: [],
  setPrimeSequence: (sequence: number[]) => set({ primeSequence: sequence }),
  detectedPrimes: [],
  setDetectedPrimes: (primes: number[]) => set({ detectedPrimes: primes }),
  visualizationMode: 'sacred',
  setVisualizationMode: (mode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower' | 'pixel') => set({ visualizationMode: mode }),
  audioPlaybackError: null,
  setAudioPlaybackError: (error: string | null) => set({ audioPlaybackError: error }),
  lastAudioEvent: null,
  setLastAudioEvent: (event: string | null) => set({ lastAudioEvent: event }),
  visualizationQuality: 'medium',
  setVisualizationQuality: (quality: 'low' | 'medium' | 'high') => set({ visualizationQuality: quality }),
  visualizationColors: ['#9b87f5', '#7E69AB', '#6E59A5'],
  setVisualizationColors: (colors: string[]) => set({ visualizationColors: colors }),
  audioContext: null,
  setAudioContext: (context: AudioContext | null) => set({ audioContext: context }),
  audioInitialized: false,
  setAudioInitialized: (initialized: boolean) => set({ audioInitialized: initialized }),
}));
