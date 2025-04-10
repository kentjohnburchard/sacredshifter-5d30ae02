
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
    // Instead of using external URLs that may time out, generate tones locally
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = createTone(audioContext, frequency, duration);
      
      const audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = audioBuffer;
      
      const offlineContext = new OfflineAudioContext(2, audioBuffer.length, audioBuffer.sampleRate);
      const offlineSource = offlineContext.createBufferSource();
      offlineSource.buffer = audioBuffer;
      offlineSource.connect(offlineContext.destination);
      offlineSource.start();
      
      offlineContext.startRendering().then(renderedBuffer => {
        const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
        const blobUrl = URL.createObjectURL(wavBlob);
        resolve(blobUrl);
      }).catch(err => {
        console.error("Error rendering audio:", err);
        // Fallback to a simple oscillator tone
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        resolve(`data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAAAABq`);
      });
    } catch (err) {
      console.error("Audio generation error:", err);
      // Return a simple placeholder if WebAudio API fails
      resolve(`data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAAAABq`);
    }
  });
}

// Helper function to convert AudioBuffer to WAV blob
function bufferToWave(audioBuffer: AudioBuffer, len: number): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const result = new Uint8Array(44 + len * numChannels * 2);
  
  // RIFF identifier
  setUint8String(result, 0, 'RIFF');
  // File length
  setUint32(result, 4, 36 + len * numChannels * 2, true);
  // RIFF type
  setUint8String(result, 8, 'WAVE');
  // Format chunk identifier
  setUint8String(result, 12, 'fmt ');
  // Format chunk length
  setUint32(result, 16, 16, true);
  // Sample format (raw)
  setUint16(result, 20, format, true);
  // Channel count
  setUint16(result, 22, numChannels, true);
  // Sample rate
  setUint32(result, 24, sampleRate, true);
  // Byte rate (sample rate * block align)
  setUint32(result, 28, sampleRate * numChannels * 2, true);
  // Block align (channel count * bytes per sample)
  setUint16(result, 32, numChannels * 2, true);
  // Bits per sample
  setUint16(result, 34, bitDepth, true);
  // Data chunk identifier
  setUint8String(result, 36, 'data');
  // Data chunk length
  setUint32(result, 40, len * numChannels * 2, true);
  
  // Write interleaved audio data
  let offset = 44;
  for (let i = 0; i < len; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i];
      const value = Math.max(-1, Math.min(1, sample));
      const val = value < 0 ? value * 0x8000 : value * 0x7FFF;
      setInt16(result, offset, val, true);
      offset += 2;
    }
  }
  
  return new Blob([result], { type: 'audio/wav' });
}

function setUint8String(data: Uint8Array, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    data[offset + i] = str.charCodeAt(i);
  }
}

function setUint16(data: Uint8Array, offset: number, value: number, littleEndian: boolean): void {
  if (littleEndian) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
  } else {
    data[offset] = (value >> 8) & 0xFF;
    data[offset + 1] = value & 0xFF;
  }
}

function setUint32(data: Uint8Array, offset: number, value: number, littleEndian: boolean): void {
  if (littleEndian) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
    data[offset + 2] = (value >> 16) & 0xFF;
    data[offset + 3] = (value >> 24) & 0xFF;
  } else {
    data[offset] = (value >> 24) & 0xFF;
    data[offset + 1] = (value >> 16) & 0xFF;
    data[offset + 2] = (value >> 8) & 0xFF;
    data[offset + 3] = value & 0xFF;
  }
}

function setInt16(data: Uint8Array, offset: number, value: number, littleEndian: boolean): void {
  if (littleEndian) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
  } else {
    data[offset] = (value >> 8) & 0xFF;
    data[offset + 1] = value & 0xFF;
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
