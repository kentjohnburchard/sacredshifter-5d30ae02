
/**
 * Audio Utilities for Sacred Shifter
 * A collection of helper functions for working with audio
 */

/**
 * Format seconds into a minutes:seconds display
 * @param seconds - The number of seconds
 * @returns A string in the format "MM:SS"
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate sound frequency for a given note/octave
 * @param note - The note (C, C#, D, etc.)
 * @param octave - The octave number
 * @returns The frequency in Hz
 */
export function calculateNoteFrequency(note: string, octave: number): number {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note.toUpperCase());
  
  if (noteIndex === -1) {
    return 0; // Invalid note
  }
  
  // A4 = 440Hz
  const a4 = 440;
  // A4 is octave 4, note 'A', which is index 9
  const semitoneOffset = (octave - 4) * 12 + (noteIndex - 9);
  
  // Equal temperament formula: f = f0 * 2^(n/12)
  return a4 * Math.pow(2, semitoneOffset / 12);
}

/**
 * Get the closest musical note to a given frequency
 * @param frequency - The frequency in Hz
 * @returns An object containing the note, octave and cents deviation
 */
export function getClosestNote(frequency: number): { note: string, octave: number, cents: number } {
  if (frequency <= 0) {
    return { note: 'A', octave: 4, cents: 0 };
  }
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // A4 = 440Hz
  const a4 = 440;
  
  // Calculate how many semitones away from A4 this frequency is
  const semitoneOffset = 12 * Math.log2(frequency / a4);
  
  // Get the closest semitone
  const closestSemitone = Math.round(semitoneOffset);
  
  // Calculate the octave and note
  let noteIndex = (9 + closestSemitone) % 12;
  if (noteIndex < 0) noteIndex += 12;
  
  const octave = 4 + Math.floor((9 + closestSemitone) / 12);
  const note = notes[noteIndex];
  
  // Calculate cents deviation (100 cents = 1 semitone)
  const cents = Math.round((semitoneOffset - closestSemitone) * 100);
  
  return { note, octave, cents };
}

/**
 * Check if a frequency is a prime number or within a small tolerance of one
 * @param frequency - The frequency to check
 * @param tolerance - The tolerance in Hz
 * @returns True if the frequency is prime or within tolerance
 */
export function isPrimeFrequency(frequency: number, tolerance: number = 0.5): boolean {
  // Check for common prime frequencies
  const primeFrequencies = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
  
  for (const prime of primeFrequencies) {
    if (Math.abs(frequency - prime) <= tolerance) {
      return true;
    }
    
    // Also check for prime frequencies in higher octaves (doubled)
    let octavePrime = prime;
    while (octavePrime * 2 <= frequency + tolerance) {
      octavePrime *= 2;
      if (Math.abs(frequency - octavePrime) <= tolerance) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Calculate the Solfeggio frequency for a specific index
 * @param index - The index (0-8 for traditional Solfeggio frequencies)
 * @returns The frequency in Hz
 */
export function solfeggioFrequency(index: number): number {
  const frequencies = [174, 285, 396, 417, 528, 639, 741, 852, 963];
  return frequencies[index % frequencies.length] || 528; // Default to 528Hz if invalid index
}

/**
 * Create a tone with the specified frequency
 * @param frequency - The frequency in Hz to generate
 * @param duration - Duration in seconds (default: 2)
 * @param volume - Volume from 0 to 1 (default: 0.5)
 * @returns An object with play and stop methods
 */
export function createTone(frequency: number, duration: number = 2, volume: number = 0.5) {
  // Create audio context
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContext();
  
  // Create oscillator
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  // Create gain node for volume control
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volume;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  let isPlaying = false;
  let stopTimeout: number | null = null;
  
  return {
    // Play the tone
    play: () => {
      if (isPlaying) return;
      
      oscillator.start();
      isPlaying = true;
      
      // Auto-stop after duration
      if (duration > 0) {
        stopTimeout = window.setTimeout(() => {
          if (isPlaying) {
            oscillator.stop();
            isPlaying = false;
          }
        }, duration * 1000);
      }
    },
    
    // Stop the tone
    stop: () => {
      if (!isPlaying) return;
      
      if (stopTimeout) {
        clearTimeout(stopTimeout);
      }
      
      oscillator.stop();
      isPlaying = false;
    },
    
    // Check if tone is playing
    isPlaying: () => isPlaying,
    
    // Change frequency of the tone
    setFrequency: (newFrequency: number) => {
      oscillator.frequency.value = newFrequency;
    },
    
    // Change volume of the tone
    setVolume: (newVolume: number) => {
      gainNode.gain.value = newVolume;
    }
  };
}

/**
 * Smoothly fade in audio for pleasing transition
 * @param audioElement - The audio element to fade in
 * @param duration - Fade duration in milliseconds
 * @param targetVolume - The target volume (0.0 to 1.0)
 */
export function fadeInAudio(audioElement: HTMLAudioElement, duration: number = 1000, targetVolume: number = 1.0): void {
  if (!audioElement) return;
  
  // Start with 0 volume
  audioElement.volume = 0;
  
  // Calculate volume increment per step
  const steps = 20;
  const volumeStep = targetVolume / steps;
  const stepDuration = duration / steps;
  
  let currentStep = 0;
  
  const fadeInterval = setInterval(() => {
    currentStep++;
    const newVolume = Math.min(currentStep * volumeStep, targetVolume);
    audioElement.volume = newVolume;
    
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
    }
  }, stepDuration);
}

/**
 * Smoothly fade out audio for pleasing transition
 * @param audioElement - The audio element to fade out
 * @param duration - Fade duration in milliseconds
 * @param callback - Optional callback function to execute after fade completes
 */
export function fadeOutAudio(audioElement: HTMLAudioElement, duration: number = 1000, callback?: () => void): void {
  if (!audioElement) return;
  
  // Get current volume
  const startVolume = audioElement.volume;
  
  // Calculate volume decrement per step
  const steps = 20;
  const volumeStep = startVolume / steps;
  const stepDuration = duration / steps;
  
  let currentStep = 0;
  
  const fadeInterval = setInterval(() => {
    currentStep++;
    const newVolume = Math.max(startVolume - (currentStep * volumeStep), 0);
    audioElement.volume = newVolume;
    
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      if (callback) callback();
    }
  }, stepDuration);
}
