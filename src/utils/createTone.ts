
/**
 * Creates a simple tone generator with play/stop functionality
 * This replaces the need for multiple audio elements and ensures
 * only the SacredAudioPlayer handles actual audio output
 */
export function createTone(initialFrequency = 432, initialVolume = 0.5) {
  // Use the global audio context
  const getAudioContext = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    return new AudioContext();
  };

  let audioContext: AudioContext;
  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let frequency = initialFrequency;
  let volume = initialVolume;
  let isCurrentlyPlaying = false;

  // Initialize audio context only when needed
  const initAudio = () => {
    if (!audioContext) {
      audioContext = getAudioContext();
    }
  };

  // Create and start the tone
  const play = () => {
    if (isCurrentlyPlaying) return;
    
    try {
      initAudio();
      
      // Create oscillator
      oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Create gain node for volume control
      gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start the tone
      oscillator.start();
      isCurrentlyPlaying = true;
    } catch (error) {
      console.error('Error starting tone:', error);
    }
  };

  // Stop the tone
  const stop = () => {
    if (!isCurrentlyPlaying) return;
    
    try {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
      }
      
      if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
      }
      
      isCurrentlyPlaying = false;
    } catch (error) {
      console.error('Error stopping tone:', error);
    }
  };

  // Check if the tone is currently playing
  const isPlaying = () => isCurrentlyPlaying;

  // Set a new frequency
  const setFrequency = (newFrequency: number) => {
    frequency = newFrequency;
    if (isCurrentlyPlaying && oscillator) {
      oscillator.frequency.value = newFrequency;
    }
  };

  // Set a new volume
  const setVolume = (newVolume: number) => {
    volume = newVolume;
    if (isCurrentlyPlaying && gainNode) {
      gainNode.gain.value = newVolume;
    }
  };

  return {
    play,
    stop,
    isPlaying,
    setFrequency,
    setVolume
  };
}
