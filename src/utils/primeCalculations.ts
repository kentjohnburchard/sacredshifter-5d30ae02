
import { isPrime } from '@/lib/primeUtils';

/**
 * Generate a sequence of prime numbers up to a limit or count
 * @param count The number of primes to generate
 * @param max Optional maximum value to check
 * @returns Array of prime numbers
 */
export const generatePrimeSequence = (count: number, max: number = 1000): number[] => {
  const primes: number[] = [];
  let num = 2; // Start checking from 2
  
  while (primes.length < count && num <= max) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  
  return primes;
};

/**
 * Find prime numbers within a frequency range
 * @param minFreq Minimum frequency
 * @param maxFreq Maximum frequency
 * @returns Array of prime frequencies in range
 */
export const findPrimesInRange = (minFreq: number, maxFreq: number): number[] => {
  const primes: number[] = [];
  
  for (let i = Math.ceil(minFreq); i <= Math.floor(maxFreq); i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  
  return primes;
};
