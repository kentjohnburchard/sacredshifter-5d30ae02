
/**
 * Checks if a number is prime
 * @param num The number to check
 * @returns True if prime, false otherwise
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  // Quickly check divisibility by 2 or 3
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  // Check through all numbers of form 6k±1 up to sqrt(num)
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
}

/**
 * Get prime numbers in a specific range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of prime numbers in the range
 */
export function getPrimesInRange(min: number, max: number): number[] {
  const primes: number[] = [];
  
  for (let i = Math.max(2, min); i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  
  return primes;
}

/**
 * Check if a frequency is a prime number or close to a prime number
 * @param frequency The frequency to check
 * @param tolerance How close to a prime is considered "prime-like"
 * @returns Object with isPrime and nearestPrime properties
 */
export function analyzeFrequency(frequency: number, tolerance: number = 1): { 
  isPrime: boolean; 
  nearestPrime: number | null; 
  distance: number;
} {
  // Round frequency to nearest whole number for prime check
  const roundedFreq = Math.round(frequency);
  
  // Check if the rounded frequency is prime
  const exactPrime = isPrime(roundedFreq);
  
  // If it's exactly prime, return early
  if (exactPrime) {
    return {
      isPrime: true,
      nearestPrime: roundedFreq,
      distance: 0
    };
  }
  
  // Find the nearest prime number within tolerance
  let lower = roundedFreq - 1;
  let upper = roundedFreq + 1;
  let nearestPrime = null;
  let distance = Infinity;
  
  // Check up to tolerance distance in both directions
  for (let i = 1; i <= tolerance; i++) {
    if (isPrime(lower)) {
      nearestPrime = lower;
      distance = i;
      break;
    }
    if (isPrime(upper)) {
      nearestPrime = upper;
      distance = i;
      break;
    }
    lower--;
    upper++;
  }
  
  return {
    isPrime: false,
    nearestPrime,
    distance
  };
}

/**
 * Calculate resonant frequencies based on prime numbers
 * @param baseFrequency Starting frequency
 * @param count Number of resonant frequencies to generate
 * @returns Array of resonant frequencies
 */
export function generateResonantFrequencies(baseFrequency: number, count: number = 5): number[] {
  const resonantFreqs: number[] = [baseFrequency];
  
  // Get some prime numbers to use as multipliers
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  
  // Generate frequencies using prime number relationships
  for (let i = 0; i < count - 1 && i < primes.length; i++) {
    // Create both harmonic (multiplication) and subharmonic (division) frequencies
    if (i % 2 === 0) {
      resonantFreqs.push(baseFrequency * primes[i] / 10);
    } else {
      resonantFreqs.push(baseFrequency / primes[i] * 10);
    }
  }
  
  return resonantFreqs;
}

/**
 * Get the optimal prime frequencies for audio healing
 * @returns Array of prime healing frequencies
 */
export function getPrimeHealingFrequencies(): number[] {
  return [
    7.83,  // Schumann Resonance
    432,   // Verdi's A, considered a "pure prime" tuning
    528,   // DNA repair frequency
    639,   // Relationship harmony
    741,   // Awakening intuition
    852,   // Spiritual order
    963,   // Cosmic consciousness
    // Prime frequencies
    233,   // Prime Fibonacci number
    257,   // Prime
    503,   // Prime
    577,   // Prime
    727,   // Prime
    911,   // Prime
  ];
}
