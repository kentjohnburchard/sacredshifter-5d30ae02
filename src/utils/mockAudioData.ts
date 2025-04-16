
/**
 * Utility functions for generating mock audio data for visualizers
 */

/**
 * Creates mock frequency data
 * @returns Uint8Array with mock frequency data
 */
export const createMockFrequencyData = (): Uint8Array => {
  const dataArray = new Uint8Array(128);
  const time = Date.now() * 0.001;
  
  for (let i = 0; i < dataArray.length; i++) {
    // Create some variation with different sine waves
    const value = 
      128 + 
      50 * Math.sin(time + i * 0.05) +
      70 * Math.sin(time * 0.7 + i * 0.1) * Math.exp(-i * 0.01);
    
    dataArray[i] = Math.min(255, Math.max(0, Math.floor(value)));
  }
  
  return dataArray;
};

/**
 * Creates mock waveform data
 * @returns Uint8Array with mock waveform data
 */
export const createMockWaveformData = (): Uint8Array => {
  const dataArray = new Uint8Array(128);
  const time = Date.now() * 0.001;
  
  for (let i = 0; i < dataArray.length; i++) {
    // Create a smooth wave pattern
    const phase = (i / dataArray.length) * Math.PI * 2;
    const value = 128 + 
                  64 * Math.sin(phase * 3 + time * 5) +
                  32 * Math.sin(phase * 7 + time * 3);
    
    dataArray[i] = Math.min(255, Math.max(0, Math.floor(value)));
  }
  
  return dataArray;
};

/**
 * Start a mock audio data generator that periodically updates
 * with new mock frequency and waveform data
 * @param setFrequencyData Function to set frequency data
 * @param setWaveformData Function to set waveform data
 * @param interval Update interval in milliseconds
 * @returns Function to stop the mock generator
 */
export const startMockAudioDataGenerator = (
  setFrequencyData: (data: Uint8Array) => void,
  setWaveformData: (data: Uint8Array) => void,
  interval: number = 50
): () => void => {
  // Start interval to periodically generate new mock data
  const intervalId = setInterval(() => {
    setFrequencyData(createMockFrequencyData());
    setWaveformData(createMockWaveformData());
  }, interval);
  
  // Return function to stop the generator
  return () => {
    clearInterval(intervalId);
  };
};
