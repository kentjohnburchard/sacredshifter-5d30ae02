/**
 * Creates an oscillator and gain node for playing a tone
 * @param frequency The frequency to play in Hertz
 * @param type The type of oscillator (default: sine)
 * @returns Object containing oscillator and gainNode
 */
export const createTone = (frequency: number, type: OscillatorType = 'sine') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create oscillator
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.3; // Set initial volume
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start oscillator
  oscillator.start();
  
  return {
    oscillator,
    gainNode,
    audioContext
  };
};
