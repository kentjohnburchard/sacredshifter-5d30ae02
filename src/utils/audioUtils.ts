
/**
 * Creates a tone with the given frequency
 */
export const createTone = (frequency: number, duration: number = 0.5) => {
  // Only attempt to create audio context if we're in a browser
  if (typeof AudioContext === 'undefined') {
    console.warn('AudioContext is not supported in this environment');
    return {
      play: () => {},
      stop: () => {},
    };
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return {
    play: () => {
      oscillator.start();
      // Fade out for smooth ending
      gainNode.gain.setValueAtTime(1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      setTimeout(() => {
        oscillator.stop();
      }, duration * 1000);
    },
    stop: () => {
      try {
        oscillator.stop();
      } catch (e) {
        // Ignore error if oscillator already stopped
      }
    },
  };
};
