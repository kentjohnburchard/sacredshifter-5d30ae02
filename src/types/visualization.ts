
// Minimal type definitions to satisfy imports
export interface VisualizerProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  showControls?: boolean;
  expandable?: boolean;
  onExpandStateChange?: (isExpanded: boolean) => void;
}

// Add the SpiralVisualizer props interface for proper typing
export interface SpiralVisualizerProps {
  params?: {
    coeffA?: number;
    coeffB?: number;
    coeffC?: number;
    freqA?: number;
    freqB?: number;
    freqC?: number;
    color?: string;
    opacity?: number;
    strokeWeight?: number;
    maxCycles?: number;
    speed?: number;
  };
  containerId?: string;
  className?: string;
}

// Empty type aliases to satisfy imports
export type VisualizerType = string;
export type ColorTheme = string;
export type SacredGeometryShape = string;
export type VisualizationMode = '2d' | '3d';
export type VisualTheme = string;
export type VisualThemeParams = any;
export type AudioAnalysisResult = {
  amplitude: number;
  frequency: number;
};
