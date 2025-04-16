
/**
 * Utility functions for prime number analysis and frequency relationships
 */

/**
 * Simple primality test
 */
export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  // Check if divisible by 2 or 3
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  // Check through all numbers of form 6k±1 up to sqrt(num)
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
};

/**
 * Analyze a frequency value and determine if it's prime
 * and its relationship to other significant frequencies
 */
export const analyzeFrequency = (frequency: number, tolerance: number = 0.1) => {
  // Round to nearest integer for primality test
  const roundedFreq = Math.round(frequency);
  
  // List of "sacred" frequencies commonly referenced
  const sacredFrequencies = [
    { value: 432, name: "Verdi's A" },
    { value: 528, name: "Solfeggio Healing" },
    { value: 963, name: "Pineal Activation" },
    { value: 741, name: "Awakening Intuition" },
    { value: 396, name: "Liberation Frequency" },
    { value: 417, name: "Facilitating Change" },
    { value: 639, name: "Connection Frequency" },
    { value: 852, name: "Spiritual Frequency" }
  ];
  
  // Find closest sacred frequency within tolerance
  const closestSacred = sacredFrequencies
    .map(f => ({ ...f, distance: Math.abs(f.value - frequency) }))
    .filter(f => f.distance <= tolerance * frequency)
    .sort((a, b) => a.distance - b.distance)[0];
  
  // Return analysis results
  return {
    frequency,
    roundedFrequency: roundedFreq,
    isPrime: isPrime(roundedFreq),
    closestSacredFrequency: closestSacred,
    harmonicDivisions: [
      { denominator: 2, value: frequency / 2 },
      { denominator: 3, value: frequency / 3 },
      { denominator: 5, value: frequency / 5 },
      { denominator: 7, value: frequency / 7 }
    ]
  };
};
