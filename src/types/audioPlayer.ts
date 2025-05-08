
// Define the types for the audio player information

export interface PlayerInfo {
  title?: string;
  artist?: string;
  source: string;
  albumArt?: string;
  frequency?: number;
  chakra?: string;
  description?: string;
  id?: string;
  groupId?: string;
  sourceType?: string;
}

export interface VisualRegistration {
  setAudioSource?: (url: string, info?: PlayerInfo) => void;
  analyzeAudio?: (audioData: Uint8Array) => void;
}

export interface GlobalAudioPlayerContextType {
  currentAudio: PlayerInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentFrequency: number | null;
  activeFrequencies: number[];
  activePrimeNumbers: number[];
  playAudio: (info: PlayerInfo) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  resetPlayer: () => void;
  setOnEndedCallback: (callback: (() => void) | null) => void;
  registerPlayerVisuals: (registration: VisualRegistration) => (() => void) | undefined;
  setVolume: (value: number) => void;
  getVolume: () => number;
  registerPrimeCallback: (callback: (prime: number) => void) => (() => void) | undefined;
  getAudioElement: () => HTMLAudioElement | null;
  forceVisualSync: () => void;
}
