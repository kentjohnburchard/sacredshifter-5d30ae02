
/**
 * Utility functions for generating audio frequencies and tones
 */

/**
 * Creates an audio buffer containing a sine wave of the specified frequency
 * 
 * @param audioContext - The Web Audio API context
 * @param frequency - The frequency in Hz to generate
 * @param duration - Duration of the tone in seconds
 * @param volume - Volume of the tone (0-1)
 * @returns AudioBuffer containing the generated tone
 */
export function createTone(
  audioContext: AudioContext,
  frequency: number,
  duration: number = 5,
  volume: number = 0.5
): AudioBuffer {
  // Create an audio buffer for the tone
  const sampleRate = audioContext.sampleRate;
  const bufferSize = duration * sampleRate;
  const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
  
  // Generate the sine wave data for left and right channels
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  // Fill the buffer with a sine wave of the given frequency
  for (let i = 0; i < bufferSize; i++) {
    const value = Math.sin(2 * Math.PI * frequency * (i / sampleRate)) * volume;
    leftChannel[i] = value;
    rightChannel[i] = value;
  }
  
  return buffer;
}

/**
 * Generates a binaural beat between two frequencies
 * 
 * @param audioContext - The Web Audio API context
 * @param baseFrequency - The base frequency in Hz
 * @param targetFrequency - The target frequency in Hz (the difference creates the binaural beat)
 * @param duration - Duration in seconds
 * @param volume - Volume of the tone (0-1)
 * @returns AudioBuffer containing the binaural beat
 */
export function createBinauralBeat(
  audioContext: AudioContext,
  baseFrequency: number,
  targetFrequency: number,
  duration: number = 10,
  volume: number = 0.5
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = duration * sampleRate;
  const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
  
  // Generate separate frequencies for left and right channels
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    // Left channel gets base frequency
    leftChannel[i] = Math.sin(2 * Math.PI * baseFrequency * t) * volume;
    // Right channel gets target frequency
    rightChannel[i] = Math.sin(2 * Math.PI * targetFrequency * t) * volume;
  }
  
  return buffer;
}

/**
 * Creates a frequency that slowly modulates between the given range
 * 
 * @param audioContext - The Web Audio API context
 * @param frequency - The center frequency in Hz
 * @param variationHz - How much to vary the frequency by (in Hz)
 * @param modulationSpeed - Speed of modulation in Hz (how fast the frequency changes)
 * @param duration - Duration in seconds
 * @param volume - Volume of the tone (0-1)
 * @returns AudioBuffer containing the modulated frequency
 */
export function createModulatedTone(
  audioContext: AudioContext,
  frequency: number,
  variationHz: number = 5,
  modulationSpeed: number = 0.1,
  duration: number = 10,
  volume: number = 0.5
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = duration * sampleRate;
  const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
  
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  let phase = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    
    // Calculate the current frequency with modulation
    const currentFreq = frequency + Math.sin(2 * Math.PI * modulationSpeed * t) * variationHz;
    
    // Generate a sample using the varying frequency
    phase += 2 * Math.PI * currentFreq / sampleRate;
    const sample = Math.sin(phase) * volume;
    
    leftChannel[i] = sample;
    rightChannel[i] = sample;
  }
  
  return buffer;
}

/**
 * Create an audio blob URL for a given frequency
 * 
 * @param frequency - The frequency to generate in Hz
 * @param duration - Duration of the sound in seconds
 * @param withAmbient - Whether to mix with ambient sounds
 * @returns Promise resolving to a blob URL for the audio
 */
export async function createFrequencyBlobUrl(
  frequency: number,
  duration: number = 60,
  withAmbient: boolean = true
): Promise<string> {
  return new Promise((resolve) => {
    try {
      // Use Web Audio API to create a frequency sound on demand
      // This eliminates dependency on external files
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = createTone(audioContext, frequency, duration);
      
      // Convert buffer to WAV format
      const wavBlob = bufferToWav(buffer, audioContext.sampleRate);
      
      // Create blob URL
      const blobUrl = URL.createObjectURL(wavBlob);
      resolve(blobUrl);
    } catch (error) {
      console.error("Error creating frequency blob:", error);
      // Generate a fallback in-memory oscillator-based tone
      resolve(generateFallbackToneUrl(frequency));
    }
  });
}

/**
 * Creates a fallback tone URL using a data URI when Blob URLs fail
 */
function generateFallbackToneUrl(frequency: number): string {
  // Create a short silent MP3 data URI as fallback
  // This is ugly but will prevent freezing when audio resources fail to load
  return "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAABAAADQgD///////////////////////////////////////////////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAALgAAA0KkCyKjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UEAAAAFsADDnAAAIXwF1c8wgARVMQU1FMy4xMDAuNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQYAABPnBZv/AEACKkDV//5ggAAAAABpBAAAACAAACXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
}

/**
 * Convert an AudioBuffer to a WAV file Blob
 */
function bufferToWav(buffer: AudioBuffer, sampleRate: number): Blob {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels * 2;
  const data = new DataView(new ArrayBuffer(44 + length));
  
  // WAV header
  writeString(data, 0, 'RIFF');
  data.setUint32(4, 36 + length, true);
  writeString(data, 8, 'WAVE');
  writeString(data, 12, 'fmt ');
  data.setUint32(16, 16, true);
  data.setUint16(20, 1, true);
  data.setUint16(22, numChannels, true);
  data.setUint32(24, sampleRate, true);
  data.setUint32(28, sampleRate * 2, true);
  data.setUint16(32, numChannels * 2, true);
  data.setUint16(34, 16, true);
  writeString(data, 36, 'data');
  data.setUint32(40, length, true);
  
  // Write the PCM samples
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = buffer.getChannelData(channel)[i];
      // Convert float audio data to 16-bit PCM
      const value = (Math.max(-1, Math.min(1, sample)) * 0x7FFF) | 0;
      data.setInt16(offset, value, true);
      offset += 2;
    }
  }
  
  return new Blob([data], { type: 'audio/wav' });
}

/**
 * Helper function to write a string to a DataView
 */
function writeString(dataView: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    dataView.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Maps frequency to a meaningful description
 * @param frequency - The frequency in Hz
 * @returns A string description of the frequency
 */
export function getFrequencyName(frequency: number): string {
  // Map known frequencies to their common names
  const frequencyMap: Record<number, string> = {
    396: "Liberation Tone (396 Hz)",
    417: "Transformation Tone (417 Hz)",
    432: "Miracle Tone (432 Hz)",
    528: "Love Frequency (528 Hz)",
    639: "Connection Frequency (639 Hz)",
    741: "Expression Frequency (741 Hz)",
    852: "Spiritual Doorway (852 Hz)",
    963: "Divine Frequency (963 Hz)",
    7.83: "Schumann Resonance (Earth's Heartbeat)",
    40: "Gamma Waves (Focus)",
    8: "Theta Waves (Meditation)"
  };
  
  return frequencyMap[frequency] || `${frequency} Hz Tone`;
}

