
// Minimal type definitions to satisfy imports
export interface VisualizerProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  showControls?: boolean;
  expandable?: boolean;
  onExpandStateChange?: (isExpanded: boolean) => void;
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
