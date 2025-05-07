
// Stub for audio utilities

/**
 * Creates a tone with the given frequency
 * This is a stub implementation to satisfy imports
 */
export const createTone = (frequency: number, duration: number = 0.5) => {
  console.warn('createTone is a stub implementation');
  return {
    play: () => console.warn('Tone play not implemented'),
    stop: () => console.warn('Tone stop not implemented'),
  };
};
