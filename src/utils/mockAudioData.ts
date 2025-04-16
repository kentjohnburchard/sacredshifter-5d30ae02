
/**
 * Mock audio data generator for visualizations when live audio isn't available
 */

/**
 * Creates mock frequency data with a random/realistic distribution
 * @param size The size of the frequency data array
 * @returns Uint8Array containing frequency data (0-255)
 */
export const createMockFrequencyData = (size: number = 128): Uint8Array => {
  const data = new Uint8Array(size);
  
  // Distribute frequency data to look like a natural audio spectrum
  for (let i = 0; i < size; i++) {
    // Create a decay curve for the frequencies (more energy in lower frequencies)
    const position = i / size;
    const baseMagnitude = Math.max(0, 120 - 100 * position);
    
    // Add some randomness
    const randomness = Math.random() * 20;
    
    // Add some time-based variation (using current time)
    const timeVariation = Math.sin(Date.now() / 1000 + i * 0.1) * 15;
    
    // Combine factors and clamp between 0-255
    data[i] = Math.min(255, Math.max(0, Math.floor(baseMagnitude + randomness + timeVariation)));
  }
  
  return data;
};

/**
 * Creates mock waveform/time domain data
 * @param size The size of the time domain data array
 * @returns Uint8Array containing waveform data (0-255)
 */
export const createMockWaveformData = (size: number = 128): Uint8Array => {
  const data = new Uint8Array(size);
  
  // Create a sine wave with some variation
  const now = Date.now() / 1000;
  for (let i = 0; i < size; i++) {
    // Base sine wave
    const position = i / size;
    
    // Create multiple overlapping sine waves with different frequencies
    const wave1 = Math.sin(position * Math.PI * 2 * 2 + now) * 40;
    const wave2 = Math.sin(position * Math.PI * 2 * 3 + now * 1.3) * 20;
    const wave3 = Math.sin(position * Math.PI * 2 * 5 + now * 0.7) * 10;
    
    // Combine waves and center around 128
    const combinedWave = 128 + wave1 + wave2 + wave3;
    
    // Clamp between 0-255
    data[i] = Math.min(255, Math.max(0, Math.floor(combinedWave)));
  }
  
  return data;
};

/**
 * Start generating mock audio data for the visualizer
 * @param onFrequencyData Callback that receives frequency data
 * @param onWaveformData Callback that receives waveform data
 * @param intervalMs How often to generate new data (in milliseconds)
 * @returns A function that can be called to stop generating data
 */
export const startMockAudioDataGenerator = (
  onFrequencyData: (data: Uint8Array) => void,
  onWaveformData: (data: Uint8Array) => void,
  intervalMs = 50
): () => void => {
  const intervalId = setInterval(() => {
    onFrequencyData(createMockFrequencyData());
    onWaveformData(createMockWaveformData());
  }, intervalMs);
  
  return () => clearInterval(intervalId);
};
