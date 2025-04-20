
interface Window {
  webkitAudioContext: typeof AudioContext;
}

export interface SceneProps {
  analyzer: AnalyserNode | null;
  activePrimes?: number[];
  mandalaSettings?: any;
}

export interface AudioSource {
  url: string;
  name: string;
  frequency?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  mode: string;
  primes: number[];
  mandalaSettings?: any;
  notes: string;
  favoriteFrequencies: number[];
}
