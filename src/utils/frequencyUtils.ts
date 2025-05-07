
export interface FrequencyData {
  frequency: number;
  name?: string;
  visualTheme?: string;
  effects?: string[];
}

// Stub function to find frequency data based on a frequency value
export function findFrequencyData(frequency: number): FrequencyData | null {
  // This is a stub implementation that would normally contain a lookup table
  return {
    frequency,
    visualTheme: "default"
  };
}

// Function to extract frequencies from text
export function extractFrequenciesFromText(text: string): number[] {
  const frequencyRegex = /\b(\d+(?:\.\d+)?)\s*(?:hz|hertz)\b/gi;
  const matches = text.match(frequencyRegex) || [];
  
  return matches.map(match => {
    const numMatch = match.match(/\d+(?:\.\d+)?/);
    return numMatch ? parseFloat(numMatch[0]) : 0;
  }).filter(freq => freq > 0);
}
