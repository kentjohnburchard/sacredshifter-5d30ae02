
/**
 * Checks if a number is prime
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
}

/**
 * Calculate prime factors of a number
 */
export function calculatePrimeFactors(num: number): number[] {
  const factors: number[] = [];
  
  // Handle 2 separately
  while (num % 2 === 0) {
    factors.push(2);
    num /= 2;
  }
  
  // Check odd numbers starting from 3
  for (let i = 3; i * i <= num; i += 2) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  
  // If num is a prime number greater than 2
  if (num > 2) {
    factors.push(num);
  }
  
  return factors;
}

/**
 * Generate a sequence of n prime numbers
 */
export function generatePrimeSequence(n: number): number[] {
  const primes: number[] = [];
  let num = 2;
  
  while (primes.length < n) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  
  return primes;
}

/**
 * Find prime numbers in a frequency range
 * Useful for liquid geometry visualization
 */
export function findPrimesInRange(min: number, max: number): number[] {
  const primes: number[] = [];
  
  for (let num = min; num <= max; num++) {
    if (isPrime(num)) {
      primes.push(num);
    }
  }
  
  return primes;
}

/**
 * Check if a number is a Fibonacci number
 * Sometimes used in sacred geometry visualizations
 */
export function isFibonacci(num: number): boolean {
  // A number is Fibonacci if 5n^2+4 or 5n^2-4 is a perfect square
  const test1 = 5 * num * num + 4;
  const test2 = 5 * num * num - 4;
  
  const sqrt1 = Math.sqrt(test1);
  const sqrt2 = Math.sqrt(test2);
  
  return Number.isInteger(sqrt1) || Number.isInteger(sqrt2);
}

/**
 * Calculate a Schumann resonance harmonic sequence
 * Base frequency is 7.83 Hz
 */
export function schumannHarmonics(count: number = 7): number[] {
  const base = 7.83;
  const harmonics = [base];
  
  for (let i = 1; i < count; i++) {
    // Schumann resonances follow approximately: f = √(n(n+1)) * 7.83/√2
    const frequency = Math.sqrt(i * (i + 1)) * base / Math.sqrt(2);
    harmonics.push(parseFloat(frequency.toFixed(2)));
  }
  
  return harmonics;
}

/**
 * Check if a frequency is close to a Schumann resonance
 */
export function isNearSchumann(frequency: number, tolerance: number = 0.3): boolean {
  const schumannFreqs = schumannHarmonics(9);
  return schumannFreqs.some(schumann => 
    Math.abs(frequency - schumann) <= tolerance
  );
}
