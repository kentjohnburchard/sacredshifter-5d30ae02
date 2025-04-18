
import { AppFunctionality } from './music';

export type SacredGeometryShape = 
  | 'flower-of-life'
  | 'metatron-cube'
  | 'fibonacci-spiral'
  | 'prime-spiral'
  | 'sri-yantra'
  | 'torus'
  | 'vesica-piscis';

export type VisualizationMode = '2d' | '3d';

export type VisualizerType = 
  | 'sacred-geometry'
  | 'prime-audio';

export type ColorTheme =
  | 'cosmic-violet'  // Default - purple, blue, gold
  | 'chakra-rainbow' // All 7 chakra colors
  | 'earth-tones'    // Browns, greens, golds
  | 'ocean-depths'   // Blues, teals, aquas
  | 'fire-essence'   // Reds, oranges, yellows
  | 'ethereal-mist'; // Whites, silvers, pale blues

export interface VisualizationSettings {
  activeShapes: SacredGeometryShape[];
  speed: number; // 0.1 to 5.0
  colorTheme: ColorTheme;
  symmetry: number; // 1 to 12
  mode: VisualizationMode;
  mirrorEnabled: boolean;
  chakraAlignmentMode: boolean;
  sensitivity: number; // 0.1 to 2.0
  brightness: number; // 0.1 to 2.0
  showGrid?: boolean; // Whether to show the sacred grid background
  gridIntensity?: number; // 0.1 to 1.0
  showPrimeAffirmations?: boolean; // Whether to show prime number affirmations
  visualizerType?: VisualizerType; // Type of visualization to use
  rotationSpeed?: number; // 0 to 3.0
}

export interface AudioAnalysisResult {
  amplitude: number;
  dominantFrequency: number;
  frequencyBands: number[];
  bpm: number | null;
  isActive: boolean;
}

export interface VisualizerProps {
  width?: number | string;
  height?: number | string;
  audioRef?: React.RefObject<HTMLAudioElement>;
  autoConnect?: boolean;
  showControls?: boolean;
  fullScreen?: boolean;
  initialSettings?: Partial<VisualizationSettings>;
  onSettingsChange?: (settings: VisualizationSettings) => void;
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
  musicFunctionality?: AppFunctionality;
  expandable?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
}
