
/**
 * Create mock frequency data for visualizer testing when no real audio is playing
 */
export const createMockFrequencyData = (): Uint8Array => {
  const data = new Uint8Array(128);
  
  // Create a few peaks to simulate frequency spectrum
  for (let i = 0; i < data.length; i++) {
    // Base level
    let value = Math.random() * 30;
    
    // Add some peaks
    if (i % 12 === 0) {
      value += Math.random() * 100 + 50;
    } else if (i % 5 === 0) {
      value += Math.random() * 70 + 20;
    }
    
    // Add some randomness
    value += Math.sin(i * 0.1) * 20;
    
    // Ensure within valid range
    data[i] = Math.min(255, Math.max(0, Math.floor(value)));
  }
  
  return data;
};

/**
 * Create mock waveform data for visualizer testing when no real audio is playing
 */
export const createMockWaveformData = (): Uint8Array => {
  const data = new Uint8Array(128);
  const center = 128;
  const amplitude = 60;
  
  for (let i = 0; i < data.length; i++) {
    // Create a sine wave with some noise
    data[i] = center + Math.sin(i * 0.2) * amplitude * Math.random() * 0.5;
  }
  
  return data;
};

let intervalId: number | null = null;

/**
 * Start generating mock audio data at regular intervals
 * @param onFrequencyData Callback to receive frequency data
 * @param onWaveformData Callback to receive waveform data
 * @param updateInterval Interval in ms between updates
 * @returns Function to stop the generator
 */
export const startMockAudioDataGenerator = (
  onFrequencyData: (data: Uint8Array) => void,
  onWaveformData: (data: Uint8Array) => void,
  updateInterval: number = 100
): () => void => {
  // Clear any existing interval
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  
  // Start new update interval
  intervalId = window.setInterval(() => {
    onFrequencyData(createMockFrequencyData());
    onWaveformData(createMockWaveformData());
  }, updateInterval);
  
  // Return cleanup function
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};
