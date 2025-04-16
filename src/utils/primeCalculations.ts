
/**
 * Prime number utility functions for frequency calculations
 */

/**
 * Checks if a number is prime
 * @param num The number to check
 * @returns boolean indicating if the number is prime
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
 * Calculates the prime factors of a number
 * @param num The number to factor
 * @returns Array of prime factors
 */
export function calculatePrimeFactors(num: number): number[] {
  const factors: number[] = [];
  let n = num;
  
  // Check for factor of 2
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }
  
  // Check for odd factors
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  
  // If n is a prime number > 2
  if (n > 2) {
    factors.push(n);
  }
  
  return factors;
}

/**
 * Finds the nearest prime number to a given frequency
 * @param frequency The frequency to analyze
 * @returns The nearest prime number
 */
export function findNearestPrime(frequency: number): number {
  if (isPrime(frequency)) return frequency;
  
  let lower = frequency - 1;
  let higher = frequency + 1;
  
  while (true) {
    if (isPrime(lower)) return lower;
    if (isPrime(higher)) return higher;
    lower--;
    higher++;
  }
}

/**
 * Analyzes a frequency for mathematical properties
 * @param frequency The frequency to analyze
 * @returns An object with mathematical properties
 */
export function analyzeFrequency(frequency: number): {
  isPrime: boolean;
  factors: number[];
  nearestPrime: number;
  primeRatio: number;
} {
  const isItPrime = isPrime(frequency);
  const factors = isItPrime ? [frequency] : calculatePrimeFactors(frequency);
  const nearestPrime = isItPrime ? frequency : findNearestPrime(frequency);
  const primeRatio = frequency / nearestPrime;
  
  return {
    isPrime: isItPrime,
    factors,
    nearestPrime,
    primeRatio
  };
}
