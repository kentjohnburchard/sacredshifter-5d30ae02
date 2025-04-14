
import { create } from 'zustand'

// Define the store's state type
interface AppState {
  isPlaying: boolean;
  audioData: Uint8Array | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setAudioData: (audioData: Uint8Array | null) => void;
}

// Create the store with initial values and methods
export const useAppStore = create<AppState>((set) => ({
  isPlaying: false,
  audioData: null,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setAudioData: (audioData) => set({ audioData }),
}))
