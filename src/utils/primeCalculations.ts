
// Re-export isPrime and other prime-related functions from primeUtils
// to maintain backward compatibility
export { isPrime, analyzeFrequency } from '@/lib/primeUtils';

// Add calculatePrimeFactors function that was missing
export function calculatePrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let divisor = 2;

  while (n > 1) {
    while (n % divisor === 0) {
      factors.push(divisor);
      n /= divisor;
    }
    divisor++;
  }

  return factors;
}

// Generate a sequence of prime numbers up to a limit
export function generatePrimeSequence(limit: number): number[] {
  const primes: number[] = [];
  
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    
    // Check if i is prime
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    
    if (isPrime) {
      primes.push(i);
    }
  }
  
  return primes;
}
